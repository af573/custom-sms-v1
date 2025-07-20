import { supabase } from "./supabaseClient"
import { randomBytes } from "crypto"

export interface CouponData {
  id: string
  code: string
  value: number
  usage_limit: number
  current_uses: number
  expires_at: string | null
  created_by: string | null
  created_at: string
  is_active: boolean
}

export class CouponManager {
  /**
   * Generates a random alphanumeric coupon code.
   */
  static generateCouponCode(length = 12): string {
    return randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length)
      .toUpperCase()
  }

  /**
   * Creates a new coupon code in the database.
   */
  static async createCoupon(
    code: string,
    value: number,
    usageLimit: number,
    expiresAt: Date | null,
    createdBy: string,
  ): Promise<{ success: boolean; coupon?: CouponData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("coupon_codes")
        .insert({
          code,
          value,
          usage_limit: usageLimit,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
          created_by: createdBy,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating coupon:", error)
        return { success: false, error: error.message }
      }

      return { success: true, coupon: data as CouponData }
    } catch (error) {
      console.error("Error in createCoupon:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  /**
   * Fetches all coupon codes (for admin/owner).
   */
  static async getCoupons(): Promise<CouponData[]> {
    try {
      const { data, error } = await supabase.from("coupon_codes").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching coupons:", error)
        return []
      }
      return data as CouponData[]
    } catch (error) {
      console.error("Error in getCoupons:", error)
      return []
    }
  }

  /**
   * Applies a coupon code.
   * Returns the coupon value if successful, otherwise null.
   */
  static async applyCoupon(code: string): Promise<{ success: boolean; value?: number; error?: string }> {
    try {
      const { data: coupon, error: fetchError } = await supabase
        .from("coupon_codes")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .single()

      if (fetchError || !coupon) {
        return { success: false, error: "Invalid or inactive coupon code" }
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        // Deactivate expired coupon
        await supabase.from("coupon_codes").update({ is_active: false }).eq("id", coupon.id)
        return { success: false, error: "Coupon code has expired" }
      }

      if (coupon.usage_limit !== -1 && coupon.current_uses >= coupon.usage_limit) {
        // Deactivate fully used coupon
        await supabase.from("coupon_codes").update({ is_active: false }).eq("id", coupon.id)
        return { success: false, error: "Coupon code has reached its usage limit" }
      }

      // Increment usage count
      const { error: updateError } = await supabase
        .from("coupon_codes")
        .update({ current_uses: coupon.current_uses + 1 })
        .eq("id", coupon.id)

      if (updateError) {
        console.error("Error updating coupon usage:", updateError)
        return { success: false, error: "Failed to apply coupon" }
      }

      return { success: true, value: coupon.value }
    } catch (error) {
      console.error("Error in applyCoupon:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  /**
   * Deactivates a coupon code.
   */
  static async deactivateCoupon(couponId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("coupon_codes").update({ is_active: false }).eq("id", couponId)

      if (error) {
        console.error("Error deactivating coupon:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("Error in deactivateCoupon:", error)
      return false
    }
  }

  /**
   * Activates a coupon code.
   */
  static async activateCoupon(couponId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("coupon_codes").update({ is_active: true }).eq("id", couponId)

      if (error) {
        console.error("Error activating coupon:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("Error in activateCoupon:", error)
      return false
    }
  }

  /**
   * Deletes a coupon code.
   */
  static async deleteCoupon(couponId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("coupon_codes").delete().eq("id", couponId)

      if (error) {
        console.error("Error deleting coupon:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("Error in deleteCoupon:", error)
      return false
    }
  }
}

// --- explicit re-exports ---
