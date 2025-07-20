'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Code, 
  Copy, 
  CheckCircle, 
  ArrowLeft, 
  Terminal, 
  Globe, 
  Shield, 
  Zap,
  Book,
  ExternalLink,
  AlertCircle,
  Info
} from 'lucide-react';

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Zap },
    { id: 'authentication', title: 'Authentication', icon: Shield },
    { id: 'endpoints', title: 'API Endpoints', icon: Globe },
    { id: 'examples', title: 'Code Examples', icon: Code },
    { id: 'webhooks', title: 'Webhooks', icon: Terminal },
    { id: 'errors', title: 'Error Handling', icon: AlertCircle }
  ];

  const codeExamples = {
    curl: `curl -X POST "https://your-domain.vercel.app/api/sms/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "number": "+8801234567890",
    "message": "Hello from SMS API!"
  }'`,
    
    javascript: `// Using fetch API
const response = await fetch('/api/sms/send', {
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

    php: `<?php
$url = 'https://your-domain.vercel.app/api/sms/send';
$data = array(
    'number' => '+8801234567890',
    'message' => 'Hello from SMS API!'
);

$options = array(
    'http' => array(
        'header' => "Content-type: application/json\\r\\n" .
                   "Authorization: Bearer YOUR_API_KEY\\r\\n",
        'method' => 'POST',
        'content' => json_encode($data)
    )
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>`,

    nodejs: `const axios = require('axios');

const sendSMS = async () => {
  try {
    const response = await axios.post(
      'https://your-domain.vercel.app/api/sms/send',
      {
        number: '+8801234567890',
        message: 'Hello from SMS API!'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

sendSMS();`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-3">
                <Book className="h-6 w-6 text-purple-400" />
                <h1 className="text-xl font-bold gradient-text-purple">API Documentation</h1>
              </div>
            </div>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-2xl p-6 border border-white/10 sticky top-8">
              <h2 className="text-lg font-bold text-white mb-4">Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Getting Started */}
              {activeSection === 'getting-started' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text-purple mb-4">Getting Started</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Welcome to the SMS API documentation. Get started in minutes with our powerful and easy-to-use API.
                    </p>
                  </div>

                  <div className="glass-dark rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">Quick Setup</h2>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Create an Account</h3>
                          <p className="text-gray-300">Sign up for a free account to get access to your API dashboard and credentials.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Generate API Key</h3>
                          <p className="text-gray-300">Create a secure API key from your dashboard with custom rate limits and permissions.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Make Your First Call</h3>
                          <p className="text-gray-300">Use your API key to send your first SMS message through our RESTful API.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-300 mb-2">Base URL</h3>
                        <p className="text-gray-300 mb-3">All API requests should be made to:</p>
                        <code className="bg-gray-800/50 px-3 py-2 rounded-lg text-blue-300 font-mono text-sm">
                          https://your-domain.vercel.app/api
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Authentication */}
              {activeSection === 'authentication' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text-purple mb-4">Authentication</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Secure your API calls with Bearer token authentication.
                    </p>
                  </div>

                  <div className="glass-dark rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">API Key Authentication</h2>
                    <p className="text-gray-300 mb-6">
                      Include your API key in the Authorization header of every request:
                    </p>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-300">Authorization Header</span>
                        <button
                          onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                          className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4 text-purple-400" />
                          <span className="text-purple-400 text-sm">
                            {copiedCode === 'auth' ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <code className="text-green-400 font-mono text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Security Best Practices</h3>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Never expose your API key in client-side code</li>
                          <li>• Use environment variables to store your API key</li>
                          <li>• Rotate your API keys regularly</li>
                          <li>• Set appropriate rate limits for your keys</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Endpoints */}
              {activeSection === 'endpoints' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text-purple mb-4">API Endpoints</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Complete reference for all available API endpoints.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Send SMS */}
                    <div className="glass-dark rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">POST</span>
                        <code className="text-lg font-mono text-white">/api/sms/send</code>
                      </div>
                      <p className="text-gray-300 mb-6">Send an SMS message to a phone number.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Request Body</h4>
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "number": "+8801234567890",
  "message": "Your SMS message content"
}`}
                            </pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Response</h4>
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "status": "success",
  "message": "SMS sent successfully",
  "messageId": "msg_123456789",
  "cost": 0.05
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Get Usage Stats */}
                    <div className="glass-dark rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold">GET</span>
                        <code className="text-lg font-mono text-white">/api/stats</code>
                      </div>
                      <p className="text-gray-300 mb-6">Get usage statistics for your account.</p>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Response</h4>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                          <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "totalSent": 1250,
  "successRate": 98.5,
  "thisMonth": 450,
  "remainingCredits": 2750
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Code Examples */}
              {activeSection === 'examples' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text-purple mb-4">Code Examples</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Ready-to-use code examples in popular programming languages.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(codeExamples).map(([lang, code]) => (
                      <div key={lang} className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                          <div className="flex items-center space-x-3">
                            <Code className="h-5 w-5 text-purple-400" />
                            <span className="text-white font-semibold capitalize">{lang === 'nodejs' ? 'Node.js' : lang}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(code, lang)}
                            className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors duration-200"
                          >
                            <Copy className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-400 text-sm">
                              {copiedCode === lang ? 'Copied!' : 'Copy'}
                            </span>
                          </button>
                        </div>
                        <div className="p-4">
                          <pre className="text-sm text-gray-300 overflow-x-auto">
                            <code>{code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Webhooks */}
              {activeSection === 'webhooks' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text-purple mb-4">Webhooks</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Receive real-time notifications about SMS delivery status.
                    </p>
                  </div>

                  <div className="glass-dark rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">Webhook Events</h2>
                    <p className="text-gray-300 mb-6">
                      Configure webhook URLs in your dashboard to receive delivery notifications:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <h4 className="text-lg font-semibold text-white mb-3">Delivery Success</h4>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "event": "sms.delivered",
  "messageId": "msg_123456789",
  "number": "+8801234567890",
  "status": "delivered",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                        </pre>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <h4 className="text-lg font-semibold text-white mb-3">Delivery Failed</h4>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "event": "sms.failed",
  "messageId": "msg_123456789",
  "number": "+8801234567890",
  "status": "failed",
  "error": "Invalid phone number",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Handling */}
              {activeSection === 'errors' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text-purple mb-4">Error Handling</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Understand and handle API errors effectively.
                    </p>
                  </div>

                  <div className="glass-dark rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">HTTP Status Codes</h2>
                    <div className="space-y-4">
                      {[
                        { code: '200', status: 'OK', description: 'Request successful' },
                        { code: '400', status: 'Bad Request', description: 'Invalid request parameters' },
                        { code: '401', status: 'Unauthorized', description: 'Invalid or missing API key' },
                        { code: '429', status: 'Too Many Requests', description: 'Rate limit exceeded' },
                        { code: '500', status: 'Internal Server Error', description: 'Server error occurred' }
                      ].map((error) => (
                        <div key={error.code} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            error.code === '200' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {error.code}
                          </span>
                          <div>
                            <div className="text-white font-semibold">{error.status}</div>
                            <div className="text-gray-300 text-sm">{error.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">Error Response Format</h2>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "status": "error",
  "message": "Invalid phone number format",
  "code": "INVALID_PHONE_NUMBER",
  "details": {
    "field": "number",
    "expected": "E.164 format (+1234567890)"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
