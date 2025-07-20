import { createHash, randomBytes } from "crypto"
import { supabase } from "./supabaseClient"

export interface ApiKeyData {
  id: string
  userId: string
  keyName: string
  rateLimit: number
  isActive: boolean
}

export class ApiKeyManager {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
  private static readonly KEY_PREFIX = "sms_"

  /**
   * Generate a new API key
   */
  static generateApiKey(): string {
    const randomPart = randomBytes(32).toString("hex")
    const timestamp = Date.now().toString()
    const combined = randomPart + timestamp
    const hash = createHash("sha256").update(combined).digest("hex")
    return `${this.KEY_PREFIX}${hash.substring(0, 48)}`
  }

  /**
   * Create a new API key for a user
   */
  static async createApiKey(
    userId: string,
    keyName: string,
    rateLimit = 100,
  ): Promise<{ success: boolean; apiKey?: string; error?: string }> {
    try {
      const apiKey = this.generateApiKey()

      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          user_id: userId,
          key_name: keyName,
          api_key: apiKey,
          rate_limit: rateLimit,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating API key:", error)
        return { success: false, error: "Failed to create API key" }
      }

      return { success: true, apiKey }
    } catch (error) {
      console.error("Error in createApiKey:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  /**
   * Validate an API key and return associated data
   */
  static async validateApiKey(apiKey: string): Promise<ApiKeyData | null> {
    try {
      if (!apiKey || !apiKey.startsWith(this.KEY_PREFIX)) {
        return null
      }

      const { data, error } = await supabase
        .from("api_keys")
        .select(`
          id,
          user_id,
          key_name,
          rate_limit,
          is_active,
          usage_count,
          last_used_at
        `)
        .eq("api_key", apiKey)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        userId: data.user_id,
        keyName: data.key_name,
        rateLimit: data.rate_limit,
        isActive: data.is_active,
      }
    } catch (error) {
      console.error("Error validating API key:", error)
      return null
    }
  }

  /**
   * Check rate limit for an API key
   */
  static async checkRateLimit(apiKeyId: string, rateLimit: number): Promise<boolean> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

      const { data, error } = await supabase
        .from("sms_logs")
        .select("id")
        .eq("api_key_id", apiKeyId)
        .gte("created_at", oneHourAgo)

      if (error) {
        console.error("Error checking rate limit:", error)
        return false
      }

      return (data?.length || 0) < rateLimit
    } catch (error) {
      console.error("Error in checkRateLimit:", error)
      return false
    }
  }

  /**
   * Log SMS usage
   */
  static async logSmsUsage(
    apiKeyId: string,
    phoneNumber: string,
    message: string,
    status: "pending" | "sent" | "failed",
    responseData?: any,
  ): Promise<void> {
    try {
      const { error } = await supabase.from("sms_logs").insert({
        api_key_id: apiKeyId,
        phone_number: phoneNumber,
        message: message,
        status: status,
        response_data: responseData,
        sent_at: status === "sent" ? new Date().toISOString() : null,
      })

      if (error) {
        console.error("Error logging SMS usage:", error)
      }

      // Update usage stats
      await supabase.rpc("update_usage_stats", {
        p_api_key_id: apiKeyId,
        p_success: status === "sent",
      })
    } catch (error) {
      console.error("Error in logSmsUsage:", error)
    }
  }

  /**
   * Get API keys for a user
   */
  static async getUserApiKeys(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select(`
          id,
          key_name,
          api_key,
          is_active,
          rate_limit,
          usage_count,
          created_at,
          last_used_at
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user API keys:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserApiKeys:", error)
      return []
    }
  }

  /**
   * Deactivate an API key
   */
  static async deactivateApiKey(apiKeyId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ is_active: false })
        .eq("id", apiKeyId)
        .eq("user_id", userId)

      if (error) {
        console.error("Error deactivating API key:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deactivateApiKey:", error)
      return false
    }
  }

  /**
   * Delete an API key
   */
  static async deleteApiKey(apiKeyId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", apiKeyId).eq("user_id", userId)

      if (error) {
        console.error("Error deleting API key:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deleteApiKey:", error)
      return false
    }
  }

  /**
   * Get usage statistics for an API key
   */
  static async getUsageStats(apiKeyId: string, days = 30): Promise<any[]> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from("usage_stats")
        .select("*")
        .eq("api_key_id", apiKeyId)
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true })

      if (error) {
        console.error("Error fetching usage stats:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUsageStats:", error)
      return []
    }
  }
}

/**
 * Middleware function to validate API key in requests
 */
export async function validateApiKeyMiddleware(apiKey: string): Promise<{
  valid: boolean
  data?: ApiKeyData
  error?: string
}> {
  if (!apiKey) {
    return { valid: false, error: "API key is required" }
  }

  const keyData = await ApiKeyManager.validateApiKey(apiKey)
  if (!keyData) {
    return { valid: false, error: "Invalid API key" }
  }

  if (!keyData.isActive) {
    return { valid: false, error: "API key is inactive" }
  }

  // Check rate limit
  const withinLimit = await ApiKeyManager.checkRateLimit(keyData.id, keyData.rateLimit)
  if (!withinLimit) {
    return { valid: false, error: "Rate limit exceeded" }
  }

  return { valid: true, data: keyData }
}

// --- explicit re-exports ---
