import { type NextRequest, NextResponse } from "next/server"
import { CouponManager } from "@/lib/couponUtils"

// POST - Apply a coupon code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        {
          status: "error",
          message: "Coupon code is required",
          error_code: "MISSING_COUPON_CODE",
        },
        { status: 400 },
      )
    }

    const result = await CouponManager.applyCoupon(code)

    if (result.success) {
      return NextResponse.json({
        status: "success",
        message: "Coupon applied successfully",
        data: {
          coupon_value: result.value,
          code: code,
          timestamp: new Date().toISOString(),
        },
      })
    } else {
      return NextResponse.json(
        {
          status: "failed",
          message: result.error || "Failed to apply coupon",
          error_code: "COUPON_APPLY_FAILED",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Coupon Apply API Error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        error_code: "INTERNAL_ERROR",
      },
      { status: 500 },
    )
  }
}
