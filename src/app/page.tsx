'use client'

import { useState } from 'react';
import { Globe, Code, Database, Zap, ChevronRight, Play, Terminal, Menu } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';


export default function RobinHero() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <Globe className="text-black dark:text-white" size={28} />
          <span className="text-2xl font-bold">Robin</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-gray-500 dark:hover:text-gray-300 transition">Features</a>
          <a href="https://github.com/Aman-web-dev/Robin/edit/main/README.md" className="hover:text-gray-500 dark:hover:text-gray-300 transition">Documentation</a>
          {/* <a href="#" className="hover:text-gray-500 dark:hover:text-gray-300 transition">Pricing</a> */}
          {/* <a href="#" className="hover:text-gray-500 dark:hover:text-gray-300 transition">Enterprise</a> */}
        </div>
        <div className="flex items-center space-x-4">
          <Link href='/auth/login' className="px-4 py-2 text-sm hover:text-gray-500 dark:hover:text-gray-300 transition">Log In</Link>
          <Link href='/auth/signup' className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center">
        {/* Left Column - Text Content */}
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            API Testing <span className="underline decoration-2 underline-offset-4">Reimagined</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg">
            Robin is the next-generation API platform for developers to design, test, and document APIs faster and more efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              className={`px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md flex items-center justify-center transition ${hovered ? 'bg-gray-800 dark:bg-gray-200' : ''}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Get Started
              <ChevronRight size={20} className="ml-2" />
            </button>
            
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white font-medium rounded-md flex items-center justify-center transition">
              Try Demo
              <Play size={18} className="ml-2" />
            </button>
          </div>
          
          <div className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Trusted by developers at:</p>
            <div className="flex flex-wrap gap-8">
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300">Microsoft</div>
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300">Airbnb</div>
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300">Spotify</div>
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300">Twitter</div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Code/UI Interface Mockup */}
        <div className="lg:w-1/2 mt-12 lg:mt-0">
          <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            {/* Mockup Header */}
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">New Request</span>
              </div>
              <div className="flex space-x-4 text-gray-500 dark:text-gray-400">
                <Code size={16} />
                <Database size={16} />
                <Terminal size={16} />
              </div>
            </div>
            
            {/* Mockup Content */}
            <div className="px-4 py-4">
              <div className="flex space-x-2 mb-4">
                <div className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium">GET</div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-md px-3 py-1 text-gray-800 dark:text-gray-300 text-sm font-mono">
                  https://api.example.com/v1/users
                </div>
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md flex items-center">
                  <Zap size={16} className="mr-1 text-black dark:text-white" />
                  <span className="text-sm">Send</span>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800 mb-4">
                <button className="px-4 py-2 border-b-2 border-black dark:border-white text-black dark:text-white">Params</button>
                <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Headers</button>
                <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Body</button>
                <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Auth</button>
              </div>
              
              {/* Response Preview */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-4 font-mono text-sm text-gray-800 dark:text-gray-300 h-52 overflow-y-auto">
                <span className="text-gray-500">// Response (200 OK)</span>
                <pre className="text-gray-800 dark:text-gray-300">
{`{
  "data": [
    {
      "id": "u_1234",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": "u_5678",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "developer"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Pills - Using shadcn Alert component styling */}
      <div className="container mx-auto px-4 pt-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-4 rounded-lg flex items-center">
            <Zap size={18} className="text-black dark:text-white mr-2" />
            <span>Lightning Fast</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-4 rounded-lg flex items-center">
            <Code size={18} className="text-black dark:text-white mr-2" />
            <span>Intuitive Interface</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-4 rounded-lg flex items-center">
            <Terminal size={18} className="text-black dark:text-white mr-2" />
            <span>CLI Support</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-4 rounded-lg flex items-center">
            <Database size={18} className="text-black dark:text-white mr-2" />
            <span>Cloud Syncing</span>
          </div>
        </div>
      </div>

      {/* Demo Alert using shadcn UI component styling */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Try Robin Today</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get started with a free account and experience the future of API testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}