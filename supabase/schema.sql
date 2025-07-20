-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sms_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- API Keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    key_name TEXT NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    rate_limit INTEGER DEFAULT 100, -- requests per hour
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- SMS Logs table
CREATE TABLE IF NOT EXISTS public.sms_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status sms_status DEFAULT 'pending',
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Usage Stats table
CREATE TABLE IF NOT EXISTS public.usage_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    sms_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(api_key_id, date)
);

-- New: Coupon Codes table
CREATE TABLE IF NOT EXISTS public.coupon_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    value NUMERIC(10, 2) NOT NULL, -- e.g., amount of credit, or percentage
    usage_limit INTEGER DEFAULT 1, -- how many times this specific code can be used
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON public.api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_sms_logs_api_key_id ON public.sms_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON public.sms_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_stats_api_key_date ON public.usage_stats(api_key_id, date);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_code ON public.coupon_codes(code);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY; -- New RLS for coupons

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Owners and admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can view logs for their API keys" ON public.sms_logs;
DROP POLICY IF EXISTS "Users can insert logs for their API keys" ON public.sms_logs;
DROP POLICY IF EXISTS "Users can view stats for their API keys" ON public.usage_stats;
DROP POLICY IF EXISTS "Users can insert stats for their API keys" ON public.usage_stats;
DROP POLICY IF EXISTS "Users can update stats for their API keys" ON public.usage_stats;
-- New: Drop existing coupon policies if they exist
DROP POLICY IF EXISTS "Owners and admins can manage coupon codes" ON public.coupon_codes;
DROP POLICY IF EXISTS "Authenticated users can view active coupon codes" ON public.coupon_codes;


-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Owners and admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- API Keys policies
CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON public.api_keys
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys" ON public.api_keys
    FOR DELETE USING (user_id = auth.uid());

-- SMS Logs policies
CREATE POLICY "Users can view logs for their API keys" ON public.sms_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE id = api_key_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert logs for their API keys" ON public.sms_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE id = api_key_id AND user_id = auth.uid()
        )
    );

-- Usage Stats policies
CREATE POLICY "Users can view stats for their API keys" ON public.usage_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE id = api_key_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert stats for their API keys" ON public.usage_stats
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE id = api_key_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update stats for their API keys" ON public.usage_stats
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE id = api_key_id AND user_id = auth.uid()
        )
    );

-- New: Coupon Codes policies
CREATE POLICY "Owners and admins can manage coupon codes" ON public.coupon_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Authenticated users can view active coupon codes" ON public.coupon_codes
    FOR SELECT USING (
        auth.role() = 'authenticated' AND is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW())
    );


-- Functions

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'user')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS handle_api_keys_updated_at ON public.api_keys;

-- Triggers for updated_at
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update usage stats
CREATE OR REPLACE FUNCTION public.update_usage_stats(
    p_api_key_id UUID,
    p_success BOOLEAN DEFAULT TRUE
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.usage_stats (api_key_id, date, sms_count, success_count, failed_count)
    VALUES (
        p_api_key_id,
        CURRENT_DATE,
        1,
        CASE WHEN p_success THEN 1 ELSE 0 END,
        CASE WHEN p_success THEN 0 ELSE 1 END
    )
    ON CONFLICT (api_key_id, date)
    DO UPDATE SET
        sms_count = usage_stats.sms_count + 1,
        success_count = usage_stats.success_count + CASE WHEN p_success THEN 1 ELSE 0 END,
        failed_count = usage_stats.failed_count + CASE WHEN p_success THEN 0 ELSE 1 END;
        
    -- Update API key usage count
    UPDATE public.api_keys
    SET usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE id = p_api_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a function to setup the first admin user (call this manually after running the script)
CREATE OR REPLACE FUNCTION public.create_admin_user(
    admin_email TEXT,
    admin_password TEXT
)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
BEGIN
    -- This function should be called manually from the Supabase dashboard
    -- It will create an admin user through the auth system
    RETURN 'Please create the admin user through Supabase Auth dashboard or use supabase.auth.signUp() in your application';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema updated successfully with coupon_codes table!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run this script in your Supabase SQL editor.';
    RAISE NOTICE '2. Ensure your environment variables are correctly set.';
    RAISE NOTICE '3. Deploy your application.';
END $$;
