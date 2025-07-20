"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"
import { useRouter } from "next/navigation"
import type { CouponData } from "@/lib/couponUtils"
import {
  Key,
  Send,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Activity,
  MessageSquare,
  TrendingUp,
  Zap,
  Shield,
  Gift,
  CalendarDays,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { format } from "date-fns" // For date formatting

interface ApiKey {
  id: string
  key_name: string
  api_key: string
  is_active: boolean
  rate_limit: number
  usage_count: number
  created_at: string
  last_used_at: string | null
}

interface UsageStats {
  date: string
  sms_count: number
  success_count: number
  failed_count: number
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(100)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState<string>("")
  // New states for coupons
  const [coupons, setCoupons] = useState<CouponData[]>([])
  const [showCreateCouponForm, setShowCreateCouponForm] = useState(false)
  const [newCouponCode, setNewCouponCode] = useState("")
  const [newCouponValue, setNewCouponValue] = useState(0)
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState(1)
  const [newCouponExpiresAt, setNewCouponExpiresAt] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null) // To check admin/owner role

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const getUserAndData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Fetch user role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        console.error("Error fetching user role:", userError)
        setUserRole("user") // Default to user if error
      } else {
        setUserRole(userData.role)
      }

      await fetchApiKeys()
      if (userData?.role === "owner" || userData?.role === "admin") {
        await fetchCoupons()
      }
      setLoading(false)
    }

    getUserAndData()
  }, [mounted, router, supabase.auth, supabase]) // Add supabase to dependency array

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys")
      const data = await response.json()
      if (data.success) {
        setApiKeys(data.data)
        if (data.data.length > 0 && !selectedApiKey) {
          setSelectedApiKey(data.data[0].id)
          await fetchUsageStats(data.data[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching API keys:", error)
    }
  }

  const fetchUsageStats = async (apiKeyId: string) => {
    try {
      const response = await fetch(`/api/stats?api_key_id=${apiKeyId}&days=30`)
      const data = await response.json()
      if (data.success) {
        setUsageStats(data.data.stats)
      }
    } catch (error) {
      console.error("Error fetching usage stats:", error)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) return

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyName: newKeyName,
          rateLimit: newKeyRateLimit,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewKeyName("")
        setNewKeyRateLimit(100)
        setShowCreateForm(false)
        await fetchApiKeys()
      }
    } catch (error) {
      console.error("Error creating API key:", error)
    }
  }

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return

    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchApiKeys()
      }
    } catch (error) {
      console.error("Error deleting API key:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const totalUsage = usageStats.reduce((sum, stat) => sum + stat.sms_count, 0)
  const totalSuccess = usageStats.reduce((sum, stat) => sum + stat.success_count, 0)
  const totalFailed = usageStats.reduce((sum, stat) => sum + stat.failed_count, 0)
  const successRate = totalUsage > 0 ? ((totalSuccess / totalUsage) * 100).toFixed(1) : "0"

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/admin/coupons")
      const data = await response.json()
      if (data.success) {
        setCoupons(data.data)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    }
  }

  const handleCreateCoupon = async () => {
    if (!newCouponCode.trim() || newCouponValue <= 0 || newCouponUsageLimit <= 0) {
      alert("Please fill all required fields correctly.")
      return
    }

    try {
      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCouponCode,
          value: newCouponValue,
          usageLimit: newCouponUsageLimit,
          expiresAt: newCouponExpiresAt || null,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewCouponCode("")
        setNewCouponValue(0)
        setNewCouponUsageLimit(1)
        setNewCouponExpiresAt("")
        setShowCreateCouponForm(false)
        await fetchCoupons()
      } else {
        alert(`Failed to create coupon: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating coupon:", error)
      alert("An unexpected error occurred while creating coupon.")
    }
  }

  const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate"
    if (!confirm(`Are you sure you want to ${action} this coupon?`)) return

    try {
      const response = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId, action }),
      })

      if (response.ok) {
        await fetchCoupons()
      } else {
        const data = await response.json()
        alert(`Failed to ${action} coupon: ${data.error}`)
      }
    } catch (error) {
      console.error(`Error ${action}ing coupon:`, error)
      alert(`An unexpected error occurred while ${action}ing coupon.`)
    }
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return

    try {
      const response = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId }),
      })

      if (response.ok) {
        await fetchCoupons()
      } else {
        const data = await response.json()
        alert(`Failed to delete coupon: ${data.error}`)
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
      alert("An unexpected error occurred while deleting coupon.")
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-6"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-500/20 border-r-blue-500 mx-auto animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <h2 className="text-2xl font-bold gradient-text-purple mb-3">Loading Dashboard</h2>
          <p className="text-gray-300 animate-pulse">Preparing your SMS management platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-dark border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SMS API Dashboard</h1>
                <p className="text-sm text-gray-300">Welcome back, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          {[
            { id: "overview", label: "Overview", icon: BarChart3, color: "from-blue-500 to-cyan-500" },
            { id: "api-keys", label: "API Keys", icon: Key, color: "from-purple-500 to-pink-500" },
            { id: "analytics", label: "Analytics", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
            { id: "settings", label: "Settings", icon: Settings, color: "from-orange-500 to-red-500" },
            // New tab for Coupon Management (only for admin/owner)
            ...(userRole === "owner" || userRole === "admin"
              ? [{ id: "coupons", label: "Coupons", icon: Gift, color: "from-yellow-500 to-orange-500" }]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl shadow-purple-500/25`
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50 backdrop-blur-sm"
              }`}
            >
              {activeTab === tab.id && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl blur-lg opacity-30 -z-10`}
                ></div>
              )}
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative glass-dark rounded-2xl p-6 border border-blue-500/20 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Total API Keys</p>
                      <p className="text-3xl font-bold text-white mb-2">{apiKeys.length}</p>
                      <div className="flex items-center text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Management System</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md"></div>
                      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl">
                        <Key className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative glass-dark rounded-2xl p-6 border border-green-500/20 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Total SMS Sent</p>
                      <p className="text-3xl font-bold text-white mb-2">{totalUsage.toLocaleString()}</p>
                      <div className="flex items-center text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Messages Delivered</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/30 rounded-xl blur-md"></div>
                      <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl">
                        <Send className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative glass-dark rounded-2xl p-6 border border-purple-500/20 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Success Rate</p>
                      <p className="text-3xl font-bold text-white mb-2">{successRate}%</p>
                      <div className="flex items-center text-xs text-purple-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Delivery Success</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/30 rounded-xl blur-md"></div>
                      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl">
                        <Activity className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative glass-dark rounded-2xl p-6 border border-orange-500/20 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Active Keys</p>
                      <p className="text-3xl font-bold text-white mb-2">
                        {apiKeys.filter((key) => key.is_active).length}
                      </p>
                      <div className="flex items-center text-xs text-orange-400">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Currently Active</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500/30 rounded-xl blur-md"></div>
                      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl">
                        <Shield className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Usage Overview (Last 30 Days)</h3>
              {usageStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="sms_count" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="success_count" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="failed_count" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No usage data available yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === "api-keys" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">API Keys Management</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 btn-hover"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Key</span>
              </button>
            </div>

            {/* Create API Key Form */}
            {showCreateForm && (
              <div className="glass-dark rounded-xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold text-white mb-4">Create New API Key</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Key Name</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter key name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Rate Limit (per hour)</label>
                    <input
                      type="number"
                      value={newKeyRateLimit}
                      onChange={(e) => setNewKeyRateLimit(Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={createApiKey}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Create Key
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* API Keys List */}
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="glass-dark rounded-xl p-6 card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{key.key_name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            key.is_active
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {key.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>Rate Limit: {key.rate_limit}/hour</span>
                        <span>Usage: {key.usage_count}</span>
                        <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                        {key.last_used_at && <span>Last Used: {new Date(key.last_used_at).toLocaleDateString()}</span>}
                      </div>

                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-800/50 px-3 py-2 rounded text-sm text-gray-300 font-mono flex-1">
                          {showApiKey === key.id ? key.api_key : "••••••••••••••••••••••••••••••••••••••••••••••••"}
                        </code>
                        <button
                          onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {showApiKey === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.api_key)}
                          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {apiKeys.length === 0 && (
                <div className="text-center py-12">
                  <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No API keys created yet</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Create Your First API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Analytics & Usage</h2>
              <select
                value={selectedApiKey}
                onChange={(e) => {
                  setSelectedApiKey(e.target.value)
                  fetchUsageStats(e.target.value)
                }}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {apiKeys.map((key) => (
                  <option key={key.id} value={key.id}>
                    {key.key_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedApiKey && usageStats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-dark rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Daily Usage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="sms_count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-dark rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Success vs Failed</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="success_count" fill="#10B981" />
                      <Bar dataKey="failed_count" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No analytics data available</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>

            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Account Role</label>
                  <input
                    type="text"
                    value="User"
                    disabled
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Documentation</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Send SMS (POST)</h4>
                  <code className="text-sm text-gray-300">
                    POST /api/sms/send
                    <br />
                    Headers: x-api-key: YOUR_API_KEY
                    <br />
                    Body: {`{"number": "01XXXXXXXXX", "message": "Your message"}`}
                  </code>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Send SMS (GET)</h4>
                  <code className="text-sm text-gray-300">
                    GET /api/sms/send?api_key=YOUR_API_KEY&number=01XXXXXXXXX&msg=Your+message
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Management Tab */}
        {activeTab === "coupons" && (userRole === "owner" || userRole === "admin") && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Coupon Code Management</h2>
              <button
                onClick={() => setShowCreateCouponForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 btn-hover"
              >
                <Plus className="h-4 w-4" />
                <span>Generate New Coupon</span>
              </button>
            </div>

            {/* Create Coupon Form */}
            {showCreateCouponForm && (
              <div className="glass-dark rounded-xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold text-white mb-4">Generate New Coupon Code</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Coupon Code (Leave empty to auto-generate)
                    </label>
                    <input
                      type="text"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., FREESMS2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Value (e.g., 10.00 for $10 credit)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number.parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Usage Limit (-1 for unlimited)
                    </label>
                    <input
                      type="number"
                      value={newCouponUsageLimit}
                      onChange={(e) => setNewCouponUsageLimit(Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Expires At (Optional, YYYY-MM-DDTHH:MM)
                    </label>
                    <input
                      type="datetime-local"
                      value={newCouponExpiresAt}
                      onChange={(e) => setNewCouponExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleCreateCoupon}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Create Coupon
                  </button>
                  <button
                    onClick={() => setShowCreateCouponForm(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Coupons List */}
            <div className="space-y-4">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <div key={coupon.id} className="glass-dark rounded-xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{coupon.code}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              coupon.is_active && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {coupon.is_active && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())
                              ? "Active"
                              : "Inactive/Expired"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <span>Value: ${coupon.value.toFixed(2)}</span>
                          <span>
                            Uses: {coupon.current_uses}/{coupon.usage_limit === -1 ? "Unlimited" : coupon.usage_limit}
                          </span>
                          {coupon.expires_at && (
                            <span className="flex items-center space-x-1">
                              <CalendarDays className="h-3 w-3" />
                              <span>Expires: {format(new Date(coupon.expires_at), "MMM dd, yyyy HH:mm")}</span>
                            </span>
                          )}
                          <span>Created: {format(new Date(coupon.created_at), "MMM dd, yyyy")}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-800/50 px-3 py-2 rounded text-sm text-gray-300 font-mono flex-1">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                          className={`p-2 ${coupon.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"} transition-colors duration-200`}
                          title={coupon.is_active ? "Deactivate Coupon" : "Activate Coupon"}
                        >
                          {coupon.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                          title="Delete Coupon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No coupon codes generated yet</p>
                  <button
                    onClick={() => setShowCreateCouponForm(true)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Generate Your First Coupon
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
