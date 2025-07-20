import { type NextRequest, NextResponse } from "next/server"
import { createAdminUser } from "@/lib/supabase-admin"

// This endpoint should be protected and only used for initial setup
export async function POST(request: NextRequest) {
  try {
    // Add your own authentication check here
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.ADMIN_SETUP_TOKEN

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await createAdminUser(email, password)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Admin user created successfully",
        userId: result.user?.id,
      })
    } else {
      return NextResponse.json({ error: "Failed to create admin user", details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Admin user creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
