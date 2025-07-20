"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"
import { CheckCircle, AlertCircle, Loader } from "lucide-react"
import Link from "next/link"

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const confirmEmail = async () => {
      const tokenHash = searchParams?.get("token_hash")
      const type = searchParams?.get("type")

      if (!tokenHash || !type) {
        setStatus("error")
        setMessage("Invalid confirmation link")
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        })

        if (error) {
          setStatus("error")
          setMessage(error.message)
        } else {
          setStatus("success")
          setMessage("Email confirmed successfully!")

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        }
      } catch (err) {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    confirmEmail()
  }, [searchParams, supabase.auth, router])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        {status === "success" && (
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        )}
        {status === "error" && (
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        )}
        {status === "loading" && (
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        )}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center animate-fadeIn">
          <div className="flex justify-center mb-8">
            <div className="relative">
              {status === "loading" && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-3xl shadow-2xl">
                    <Loader className="h-12 w-12 text-white animate-spin" />
                  </div>
                </>
              )}
              {status === "success" && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-5 rounded-3xl shadow-2xl">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </>
              )}
              {status === "error" && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-xl opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-red-500 to-pink-500 p-5 rounded-3xl shadow-2xl">
                    <AlertCircle className="h-12 w-12 text-white" />
                  </div>
                </>
              )}
            </div>
          </div>

          {status === "loading" && (
            <>
              <h1 className="text-5xl font-bold gradient-text-purple mb-4">Confirming Email</h1>
              <p className="text-xl text-gray-300 mb-8">Please wait while we verify your account...</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-5xl font-bold gradient-text-purple mb-4">Welcome Aboard!</h1>
              <p className="text-xl text-gray-300 mb-8">Your premium account has been activated successfully.</p>

              <div className="glass-dark rounded-2xl p-8 border border-white/10 mb-8">
                <p className="text-gray-300 mb-4">Redirecting you to your dashboard...</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-pulse"></div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-5xl font-bold gradient-text-purple mb-4">Confirmation Failed</h1>
              <p className="text-xl text-gray-300 mb-8">{message}</p>

              <div className="space-y-4">
                <Link
                  href="/auth/signup"
                  className="block px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  Try Signing Up Again
                </Link>
                <Link href="/auth/login" className="block text-gray-400 hover:text-white transition-colors">
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
