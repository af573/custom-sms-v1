-- Run this script AFTER the main setup script
-- This will help you create an admin user manually

-- First, you need to create a user through the normal signup process
-- Then run this to upgrade them to admin/owner role

-- Replace 'user-email@example.com' with the actual email of the user you want to make admin
UPDATE public.users 
SET role = 'owner' 
WHERE email = 'your-admin-email@example.com';

-- Verify the update
SELECT id, email, role, created_at 
FROM public.users 
WHERE role IN ('owner', 'admin');
