"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Code,
  Globe,
  MessageSquare,
  Users,
  BarChart3,
  Lock,
  CheckCircle,
  Github,
  ExternalLink,
  Play,
  Copy,
  Terminal,
} from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [copiedCode, setCopiedCode] = useState("")
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const codeExamples = {
    curl: `curl -X POST "https://your-domain.vercel.app/api/sms/send" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "number": "+8801234567890",
  "message": "Hello from SMS API!"
}'`,
    javascript: `const response = await fetch('/api/sms/send', {
method: 'POST',
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
},
body: JSON.stringify({
  number: '+8801234567890',
  message: 'Hello from SMS API!'
})
});

const result = await response.json();
console.log(result);`,
    python: `import requests

url = "https://your-domain.vercel.app/api/sms/send"
headers = {
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
data = {
  "number": "+8801234567890",
  "message": "Hello from SMS API!"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text-purple">SMS API</h1>
              <p className="text-xs text-gray-400">Professional Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fadeIn">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 text-sm text-purple-300">
                <Sparkles className="h-4 w-4" />
                <span>Professional SMS API Platform</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text-purple">Powerful SMS API</span>
              <br />
              <span className="text-white">for Developers</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Send SMS messages globally with our reliable, scalable, and developer-friendly API. Built with Next.js,
              powered by Supabase, and designed for modern applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/auth/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl btn-hover"
              >
                <span>Start Building Now</span>
                <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/docs"
                className="group px-8 py-4 border border-gray-600 text-white rounded-xl font-semibold text-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5 inline" />
                View Documentation
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: "API Calls", value: "99.9%", desc: "Uptime" },
                { label: "Countries", value: "190+", desc: "Supported" },
                { label: "Delivery", value: "<3s", desc: "Average Time" },
                { label: "Developers", value: "10K+", desc: "Trust Us" },
              ].map((stat, index) => (
                <div key={index} className="text-center animate-slideIn" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-bold gradient-text-purple mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text-purple mb-4">Why Choose Our SMS API?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built for developers, designed for scale, optimized for performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "Bank-level security with API key authentication, rate limiting, and encrypted data transmission.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Sub-second API response times with global CDN and optimized infrastructure.",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Send SMS to 190+ countries with local carrier partnerships for best delivery rates.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Code,
                title: "Developer Friendly",
                description: "RESTful API, comprehensive docs, SDKs for popular languages, and webhook support.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Detailed delivery reports, usage analytics, and performance metrics dashboard.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Users,
                title: "Team Management",
                description: "Multi-user accounts, role-based permissions, and collaborative API key management.",
                color: "from-red-500 to-pink-500",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300`}
                ></div>
                <div className="relative glass-dark rounded-2xl p-8 border border-white/10 card-hover">
                  <div className="relative mb-6">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl blur-md opacity-30`}
                    ></div>
                    <div className={`relative bg-gradient-to-r ${feature.color} p-4 rounded-xl w-fit`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section id="documentation" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text-purple mb-4">Quick Start Guide</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in minutes with our simple and powerful API
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Steps */}
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  description: "Sign up for free and get instant access to your dashboard with API credentials.",
                  icon: Users,
                },
                {
                  step: "02",
                  title: "Generate API Key",
                  description: "Create secure API keys with custom rate limits and permissions for your applications.",
                  icon: Lock,
                },
                {
                  step: "03",
                  title: "Send SMS",
                  description: "Make your first API call and send SMS messages to any phone number worldwide.",
                  icon: MessageSquare,
                },
                {
                  step: "04",
                  title: "Monitor & Scale",
                  description: "Track delivery rates, monitor usage, and scale your SMS operations effortlessly.",
                  icon: BarChart3,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-30"></div>
                      <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <item.icon className="h-6 w-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Code Examples */}
            <div className="space-y-6">
              <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <Terminal className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-semibold">cURL Example</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeExamples.curl, "curl")}
                    className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400 text-sm">{copiedCode === "curl" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{codeExamples.curl}</code>
                  </pre>
                </div>
              </div>

              <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-semibold">JavaScript Example</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeExamples.javascript, "js")}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 text-sm">{copiedCode === "js" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{codeExamples.javascript}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text-purple mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for testing and small projects",
                features: ["100 SMS/month", "Basic API access", "Email support", "Dashboard access"],
                color: "from-gray-500 to-gray-600",
                popular: false,
              },
              {
                name: "Professional",
                price: "$29",
                description: "Ideal for growing businesses",
                features: [
                  "10,000 SMS/month",
                  "Priority API access",
                  "Webhook support",
                  "Advanced analytics",
                  "24/7 support",
                ],
                color: "from-purple-500 to-blue-500",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large-scale operations",
                features: [
                  "Unlimited SMS",
                  "Dedicated infrastructure",
                  "Custom integrations",
                  "SLA guarantee",
                  "Account manager",
                ],
                color: "from-orange-500 to-red-500",
                popular: false,
              },
            ].map((plan, index) => (
              <div key={index} className="relative group">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${plan.color} rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300`}
                ></div>
                <div className="relative glass-dark rounded-2xl p-8 border border-white/10 card-hover">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold gradient-text-purple mb-2">
                      {plan.price}
                      {plan.price !== "Free" && plan.price !== "Custom" && (
                        <span className="text-lg text-gray-400">/month</span>
                      )}
                    </div>
                    <p className="text-gray-300">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/signup"
                    className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transform hover:scale-105"
                        : "border border-gray-600 text-white hover:border-purple-500 hover:bg-purple-500/10"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text-purple">SMS API</h3>
                  <p className="text-xs text-gray-400">Professional Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                The most reliable SMS API platform for developers and businesses worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    SDKs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Webhooks
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Status Page
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 SMS API Platform. Crafted with precision by{" "}
              <span className="gradient-text-purple font-semibold">〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴</span>
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
