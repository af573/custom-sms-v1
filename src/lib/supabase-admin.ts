import { createClient } from "@supabase/supabase-js"

// Admin client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Helper function to create admin user programmatically
export async function createAdminUser(email: string, password: string) {
  try {
    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      throw authError
    }

    // Update user role to owner
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ role: "owner" })
      .eq("id", authData.user.id)

    if (updateError) {
      throw updateError
    }

    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return { success: false, error }
  }
}

// --- explicit re-export for build tools ---
