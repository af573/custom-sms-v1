"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Zap, Shield, Sparkles, CheckCircle, ArrowRight, Star } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NODE_ENV === "production" ? "https://your-domain.vercel.app" : window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Check your email for the confirmation link!")
        // Clear form
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        {/* Premium Floating Elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Premium Header */}
          <div className="text-center animate-fadeIn">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-75 animate-pulse group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-5 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <Zap className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-6xl font-bold gradient-text-purple tracking-tight">Join Elite</h1>
                <p className="text-2xl text-gray-300 font-light">Create your premium account</p>
              </div>

              {/* Premium Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 text-sm text-purple-300 shadow-lg">
                  <Shield className="h-4 w-4" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 text-sm text-blue-300 shadow-lg">
                  <Sparkles className="h-4 w-4" />
                  <span>Premium Features</span>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 text-sm text-green-300 shadow-lg">
                  <Star className="h-4 w-4" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Signup Form */}
          <div className="relative group animate-slideIn">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative glass-dark rounded-3xl p-10 shadow-2xl border border-white/20 backdrop-blur-xl">
              <form className="space-y-8" onSubmit={handleSignup}>
                {error && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-2xl p-5 animate-fadeIn shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                    <p className="relative text-red-400 text-sm font-medium flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5 animate-fadeIn shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
                    <div className="relative flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-400 text-sm font-medium">{success}</p>
                        <p className="text-green-300 text-xs mt-1">
                          Please check your spam folder if you don't see the email.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-200 mb-3 tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-6 w-6 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-14 pr-4 py-5 border border-gray-600/50 rounded-2xl bg-gray-800/30 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-gray-500/50 text-lg shadow-lg"
                        placeholder="Enter your professional email"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-bold text-gray-200 mb-3 tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-6 w-6 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-14 pr-14 py-5 border border-gray-600/50 rounded-2xl bg-gray-800/30 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-gray-500/50 text-lg shadow-lg"
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-700/20 rounded-r-2xl transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-6 w-6 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-bold text-gray-200 mb-3 tracking-wide"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-6 w-6 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-14 pr-14 py-5 border border-gray-600/50 rounded-2xl bg-gray-800/30 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-gray-500/50 text-lg shadow-lg"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-700/20 rounded-r-2xl transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-6 w-6 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center py-5 px-8 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl btn-hover shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="spinner mr-3"></div>
                          <span>Creating your premium account...</span>
                        </div>
                      ) : (
                        <>
                          <span>Create Premium Account</span>
                          <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <div className="text-center pt-6">
                  <p className="text-gray-400 text-lg">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 hover:from-purple-300 hover:via-pink-300 hover:to-blue-300 transition-all duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="text-center text-sm text-gray-400 animate-fadeIn">
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
              <p className="font-medium">© 2024 Premium SMS API Platform</p>
              <p>
                Engineered with excellence by{" "}
                <span className="gradient-text-purple font-bold">〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
