'use client'

import { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, PlusIcon, PlayIcon, Save } from 'lucide-react';









// src/types/ApiRequest.ts
interface ApiRequest {
  // Request-related properties
  request_url: string; // The full URL of the API endpoint (e.g., https://api.example.com/v1/users)
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'; // HTTP method
  headers: Record<string, string>; // Request headers (e.g., Authorization, Content-Type)
  body?: any; // Request body (e.g., JSON payload for POST/PUT)
  query_params?: Record<string, string | string[]>; // Query parameters (e.g., ?id=123&filter=active)
  path_params?: Record<string, string>; // Path parameters (e.g., /users/:id -> { id: '123' })
  authentication?: {
    type: 'Bearer' | 'Basic' | 'APIKey' | 'None'; // Authentication type
    token?: string; // Token or credentials (e.g., Bearer token, API key)
  }; // Authentication details
  timeout?: number; // Request timeout in milliseconds
  content_type?: string; // Content-Type header (e.g., application/json)
  accept?: string; // Accept header (e.g., application/json)

  // Response-related properties
  response?: {
    status: number; // HTTP status code (e.g., 200, 404)
    status_text: string; // Status text (e.g., 'OK', 'Not Found')
    headers: Record<string, string>; // Response headers
    data?: any; // Response body (e.g., JSON data)
    time_taken?: number; // Time taken for the response in milliseconds
  };

  // Metadata
  timestamp: string; // ISO timestamp of when the request was made
  request_id?: string; // Unique ID for tracking the request
  retries?: number; // Number of retry attempts (if applicable)
  environment?: 'development' | 'staging' | 'production'; // Environment context
  client_ip?: string; // Client IP address
  user_agent?: string; // User-Agent header
  error?: {
    message: string; // Error message (if the request failed)
    code?: string; // Error code (e.g., 'INVALID_TOKEN')
    details?: any; // Additional error details
  }; // Error details (if applicable)
}







export default function ApiPlayground() {
  const [history, setHistory] = useState<ApiRequest[]>([]);

  const [request,setRequest]=useState<ApiRequest> ({
    request_url: "",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: {},
    query_params: {},
    path_params: {},
    authentication: {
      type: "None",
      token: "",
    },
    timeout: 5000,
    content_type: "application/json",
    accept: "application/json",
    response: {
      status: 0,
      status_text: "",
      headers: {},
      data: null,
      time_taken: 0,
    },
    timestamp: new Date().toISOString(),
    request_id: "",
    retries: 0,
    environment: "development",
    client_ip: "",
    user_agent: "",
    error: {
      message: "",
      code: "",
      details: null,
    },
  });
  

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="py-4 px-6 bg-black text-white border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">API Playground</h1>
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-gray-800">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Collections</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {history.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start font-normal px-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className={`w-12 text-xs rounded mr-2 px-2 py-1 ${
                  item.method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  item.method === 'POST' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  item.method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {item.method}
                </div>
                {item.request_url}
              </Button>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 overflow-auto p-4">
          {/* Request URL bar */}
          <div className="flex mb-4 gap-2">
            <Select value={request.method}>
              <SelectTrigger className="w-24 bg-white dark:bg-gray-950">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
            
            <Input 
              value={request.request_url}
              className="flex-1 bg-white dark:bg-gray-950"
              placeholder="Enter request URL"
            />
            
            <Button className="bg-black hover:bg-gray-800 text-white">
              <SendIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>

          {/* Request/Response tabs */}
          <Card className="mb-4">
            <Tabs defaultValue="body">
              <CardHeader className="pb-0">
                <TabsList className="grid grid-cols-3 w-64">
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="params">Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="body" className="mt-0">
                  <Textarea 
                    value={request.body}
                    className="font-mono bg-white dark:bg-gray-950 min-h-32"
                    placeholder="Enter request body (JSON)"
                  />
                </TabsContent>
                <TabsContent value="params" className="mt-0">
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Key" className="bg-white dark:bg-gray-950" />
                    <Input placeholder="Value" className="bg-white dark:bg-gray-950" />
                    <Input placeholder="Description (optional)" className="bg-white dark:bg-gray-950" />
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Parameter
                  </Button>
                </TabsContent>
                <TabsContent value="headers" className="mt-0">
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Key" className="bg-white dark:bg-gray-950" />
                    <Input placeholder="Value" className="bg-white dark:bg-gray-950" />
                    <Input placeholder="Description (optional)" className="bg-white dark:bg-gray-950" />
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Header
                  </Button>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Response */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Response</CardTitle>
                {request.response?.status && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{request.response?.time_taken}</span>
                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">
                      {request.response?.status}
                    </span>
                  </div>
                )}
              </div>
              <Tabs defaultValue="response-body">
                <TabsList className="grid grid-cols-3 w-64">
                  <TabsTrigger value="response-body">Body</TabsTrigger>
                  <TabsTrigger value="response-headers">Headers</TabsTrigger>
                  <TabsTrigger value="response-cookies">Cookies</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea 
                value={request.response?.data}
                readOnly
                className="font-mono bg-gray-50 dark:bg-gray-900 min-h-64"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}