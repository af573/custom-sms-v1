import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"
import { CouponManager } from "@/lib/couponUtils"

// Helper to check if user is admin/owner
async function isAdminOrOwner(userId: string): Promise<boolean> {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error || !data) {
    console.error("Error fetching user role:", error)
    return false
  }
  return data.role === "owner" || data.role === "admin"
}

// GET - Fetch all coupon codes (Admin/Owner only)
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await isAdminOrOwner(user.id))) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    const coupons = await CouponManager.getCoupons()
    return NextResponse.json({ success: true, data: coupons })
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new coupon code (Admin/Owner only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await isAdminOrOwner(user.id))) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { code, value, usageLimit, expiresAt } = body

    if (!code || value === undefined || usageLimit === undefined) {
      return NextResponse.json({ error: "Code, value, and usageLimit are required" }, { status: 400 })
    }

    const result = await CouponManager.createCoupon(
      code,
      Number.parseFloat(value),
      Number.parseInt(usageLimit),
      expiresAt ? new Date(expiresAt) : null,
      user.id,
    )

    if (result.success) {
      return NextResponse.json({ success: true, message: "Coupon created successfully", data: result.coupon })
    } else {
      return NextResponse.json({ error: result.error || "Failed to create coupon" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update coupon status (deactivate/activate) (Admin/Owner only)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await isAdminOrOwner(user.id))) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { couponId, action } = body

    if (!couponId || !action) {
      return NextResponse.json({ error: "Coupon ID and action are required" }, { status: 400 })
    }

    let success = false
    if (action === "deactivate") {
      success = await CouponManager.deactivateCoupon(couponId)
    } else if (action === "activate") {
      success = await CouponManager.activateCoupon(couponId)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (success) {
      return NextResponse.json({ success: true, message: `Coupon ${action}d successfully` })
    } else {
      return NextResponse.json({ error: `Failed to ${action} coupon` }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete coupon code (Admin/Owner only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await isAdminOrOwner(user.id))) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { couponId } = body

    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 })
    }

    const success = await CouponManager.deleteCoupon(couponId)

    if (success) {
      return NextResponse.json({ success: true, message: "Coupon deleted successfully" })
    } else {
      return NextResponse.json({ error: "Failed to delete coupon" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error deleting coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
