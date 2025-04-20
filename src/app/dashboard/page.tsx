"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SendIcon, PlusIcon, PlayIcon, Save, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/auth-context";

// Interface for API Request
interface ApiRequest {
  user_id?: string;
  request_url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
  headers: Record<string, string>;
  body?: any;
  body_raw?: string;
  query_params?: Record<string, string>;
  path_params?: Record<string, string>;
  authentication?: {
    type: "Bearer" | "Basic" | "APIKey" | "None";
    token?: string;
  };
  timeout?: number;
  content_type?: string;
  accept?: string;
  response?: {
    status: number;
    status_text: string;
    headers: Record<string, string>;
    data?: any;
    data_raw?: string;
    time_taken?: number;
  };
  timestamp: string;
  request_id: string;
  name?: string;
  retries?: number;
  environment?: "development" | "staging" | "production";
  client_ip?: string;
  user_agent?: string;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Define the API response type
interface ApiResponse {
  message: string;
  data: ApiRequest[];
  pagination: {
    limit: number;
    skip: number;
    total: number;
    hasMore: boolean;
  };
}

export default function ApiPlayground() {
  // Load saved history from localStorage on initial render
  const [history, setHistory] = useState<ApiRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [currentRequestId, setCurrentRequestId] = useState<string>(uuidv4());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [bodyInputValue, setBodyInputValue] = useState("");
  const [params, setParams] = useState<
    { key: string; value: string; description: string }[]
  >([{ key: "", value: "", description: "" }]);
  const [headerInputs, setHeaderInputs] = useState<
    { key: string; value: string; description: string }[]
  >([{ key: "Content-Type", value: "application/json", description: "" }]);
  const { user } = useAuth();
  console.log("This is your User", user);

  const emptyRequest: ApiRequest = {
    user_id: user?.id || "",
    request_url: "",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: {},
    body_raw: "",
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
      data_raw: "",
      time_taken: 0,
    },
    timestamp: new Date().toISOString(),
    request_id: currentRequestId,
    retries: 0,
    environment: "development",
    client_ip: "",
    user_agent: "",
    error: {
      message: "",
      code: "",
      details: null,
    },
  };
  console.log(emptyRequest);

  const [request, setRequest] = useState<ApiRequest>(emptyRequest);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setRequestsLoading(true);
      // setError(null);

      try {
        const response = await axios.get<ApiResponse>("/api/requests", {
          params: {
            user_id: user.id, // Filter by authenticated user's ID
            limit: 10, // Get the last 10 requests
            skip: 0, // Start from the first page
          },
        });

        setHistory(response.data.data);
      } catch (e: any) {
        console.error("Error fetching requests:", e);
        // setError(e.response?.data?.error || e.message || "Failed to fetch request history");
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  useEffect(() => {
    // Update headers whenever headerInputs change
    const newHeaders: Record<string, string> = {};
    headerInputs.forEach((header) => {
      if (header.key && header.value) {
        newHeaders[header.key] = header.value;
      }
    });

    setRequest((prev) => ({
      ...prev,
      headers: newHeaders,
    }));
  }, [headerInputs]);

  useEffect(() => {
    // Update query params whenever params change
    const newParams: Record<string, string> = {};
    params.forEach((param) => {
      if (param.key && param.value) {
        newParams[param.key] = param.value;
      }
    });

    setRequest((prev) => ({
      ...prev,
      query_params: newParams,
    }));
  }, [params]);

  const handleMethodChange = (value: string) => {
    setRequest((prev) => ({
      ...prev,
      method: value as ApiRequest["method"],
    }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequest((prev) => ({
      ...prev,
      request_url: e.target.value,
    }));
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyInputValue(e.target.value);

    try {
      // Only try to parse JSON if there's content
      if (e.target.value.trim()) {
        const parsedBody = JSON.parse(e.target.value);
        setRequest((prev) => ({
          ...prev,
          body: parsedBody,
          body_raw: e.target.value,
        }));
      } else {
        setRequest((prev) => ({
          ...prev,
          body: {},
          body_raw: "",
        }));
      }
    } catch (error) {
      // Keep the raw value even if it's not valid JSON
      setRequest((prev) => ({
        ...prev,
        body_raw: e.target.value,
      }));
    }
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "", description: "" }]);
  };

  const updateParam = (
    index: number,
    field: "key" | "value" | "description",
    value: string
  ) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const removeParam = (index: number) => {
    const newParams = [...params];
    newParams.splice(index, 1);
    setParams(newParams);
  };

  const addHeader = () => {
    setHeaderInputs([...headerInputs, { key: "", value: "", description: "" }]);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value" | "description",
    value: string
  ) => {
    const newHeaders = [...headerInputs];
    newHeaders[index][field] = value;
    setHeaderInputs(newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headerInputs];
    newHeaders.splice(index, 1);
    setHeaderInputs(newHeaders);
  };

  const makeRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      // Create URL with query parameters
      let url = request.request_url;
      const queryParams = request.query_params || {};
      const queryString = Object.keys(queryParams)
        .filter((key) => queryParams[key])
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
        )
        .join("&");

      if (queryString) {
        url += `?${queryString}`;
      }

      // Set up axios config
      const config = {
        url,
        method: request.method.toLowerCase(),
        headers: request.headers,
        timeout: request.timeout,
      };

      // // Add body for non-GET requests
      // if (request.method !== "GET" && request.body_raw) {
      //   try {
      //     config["data"] = JSON.parse(request.body_raw);
      //   } catch {
      //     config["data"] = request.body_raw;
      //   }
      // }

      // Make the request
      const response = await axios(config);
      const endTime = performance.now();

      // Format response data
      let responseData = response.data;
      let responseDataRaw = "";

      try {
        if (typeof responseData === "object") {
          responseDataRaw = JSON.stringify(responseData, null, 2);
        } else {
          responseDataRaw = String(responseData);
        }
      } catch (e) {
        responseDataRaw = "Error formatting response data";
      }

      // Update the request state with response
      const updatedRequest = {
        ...request,
        response: {
          status: response.status,
          status_text: response.statusText,
          headers: response.headers as Record<string, string>,
          data: responseData,
          data_raw: responseDataRaw,
          time_taken: Math.round(endTime - startTime),
        },
        timestamp: new Date().toISOString(),
      };

      setRequest(updatedRequest);

      // Add to history if not already there
      const existingIndex = history.findIndex(
        (item) => item.request_id === updatedRequest.request_id
      );
      if (existingIndex >= 0) {
        const newHistory = [...history];
        newHistory[existingIndex] = updatedRequest;
        setHistory(newHistory);
        localStorage.setItem("apiRequestHistory", JSON.stringify(newHistory));
      }
    } catch (error) {
      const endTime = performance.now();
      console.error("Request error:", error);

      // Update request with error info
      let errorMessage = "Unknown error occurred";
      let responseData = null;
      let status = 0;
      let statusText = "";
      let responseHeaders = {};

      if (axios.isAxiosError(error)) {
        errorMessage = error.message;
        if (error.response) {
          status = error.response.status;
          statusText = error.response.statusText;
          responseData = error.response.data;
          responseHeaders = error.response.headers;
        }
      }

      const updatedRequest = {
        ...request,
        response: {
          status,
          status_text: statusText,
          headers: responseHeaders as Record<string, string>,
          data: responseData,
          data_raw: responseData ? JSON.stringify(responseData, null, 2) : "",
          time_taken: Math.round(endTime - startTime),
        },
        error: {
          message: errorMessage,
          code: status.toString(),
          details: error,
        },
        timestamp: new Date().toISOString(),
      };

      setRequest(updatedRequest);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRequest = async () => {
    const requestToSave = {
      ...request,
      user_id: user?.id || "",
      name:
        requestName ||
        `${request.method} ${request.request_url.slice(0, 30)}...`,
      timestamp: new Date().toISOString(),
    };
    console.log(requestToSave);

    try {
      const response = await axios.post("/api/requests", requestToSave);
      console.log("Request saved to server:", response.data);

      const existingIndex = history.findIndex(
        (item) => item.request_id === requestToSave.request_id
      );
      let newHistory = [...history];

      if (existingIndex >= 0) {
        newHistory[existingIndex] = requestToSave;
      } else {
        newHistory = [requestToSave, ...history];
      }

      setHistory(newHistory);
      localStorage.setItem("apiRequestHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error saving request to server:", error);
    }

    setShowSaveDialog(false);
    setRequestName("");
  };

  const loadRequest = (requestId: string) => {
    const requestToLoad = history.find((item) => item.request_id === requestId);
    if (requestToLoad) {
      // Update body input value for display
      setBodyInputValue(requestToLoad.body_raw || "");

      // Create header inputs from the loaded request
      if (requestToLoad.headers) {
        const newHeaderInputs = Object.entries(requestToLoad.headers).map(
          ([key, value]) => ({
            key,
            value: value as string,
            description: "",
          })
        );
        setHeaderInputs(
          newHeaderInputs.length
            ? newHeaderInputs
            : [{ key: "", value: "", description: "" }]
        );
      }

      // Create param inputs from the loaded request
      if (requestToLoad.query_params) {
        const newParams = Object.entries(requestToLoad.query_params).map(
          ([key, value]) => ({
            key,
            value: value as string,
            description: "",
          })
        );
        setParams(
          newParams.length
            ? newParams
            : [{ key: "", value: "", description: "" }]
        );
      }

      setCurrentRequestId(requestToLoad.request_id);
      setRequest(requestToLoad);
    }
  };

  const createNewRequest = () => {
    const newId = uuidv4();
    setCurrentRequestId(newId);
    setBodyInputValue("");
    setParams([{ key: "", value: "", description: "" }]);
    setHeaderInputs([
      { key: "Content-Type", value: "application/json", description: "" },
    ]);
    setRequest({
      ...emptyRequest,
      request_id: newId,
      timestamp: new Date().toISOString(),
    });
  };

  // const deleteRequest = (requestId: string) => {
  //   const newHistory = history.filter((item) => item.request_id !== requestId);
  //   setHistory(newHistory);
  //   localStorage.setItem("apiRequestHistory", JSON.stringify(newHistory));

  //   // If the current request is deleted, create a new one
  //   if (requestId === currentRequestId) {
  //     createNewRequest();
  //   }
  // };


  const deleteRequest = async (request_id: string) => {
    if (!user) {
      // setError("You must be logged in to delete requests");
      return;
    }
  
    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }
  
    try {
      const response = await axios.delete(`/api/requests/${request_id}`);
      setHistory((prev) => prev.filter((request) => request.request_id !== request_id));
      // setError(null);
    } catch (e: any) {
      // setError(e.response?.data?.error || e.message || "Failed to delete request");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="py-4 px-6 text-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">API Playground</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-primary"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-primary"
              onClick={createNewRequest}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 dark:border-primary p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Saved Requests</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={createNewRequest}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 max-h-[calc(100vh-8rem)] ">

            
            {requestsLoading ? (
              <div className="text-sm text-gray-500 px-2 flex items-center justify-center py-3 space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                <span>Loading requests...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-sm text-gray-500 px-2 py-4 text-center">
                <p>No saved requests</p>
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((item) => (
                  <div
                    key={item.request_id}
                    className="flex items-center group rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      className={`w-full  justify-start font-normal px-4 py-4 text-gray-700 dark:text-gray-300 ${
                        item.request_id === currentRequestId
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => loadRequest(item.request_id)}
                    >
                      <div className="flex items-center w-full">
                        <div
                          className={`min-w-[48px] text-xs font-medium rounded mr-3 px-2 py-1 ${
                            item.method === "GET"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : item.method === "POST"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : item.method === "PUT"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {item.method}
                        </div>
                        <div className="">
                          <div className="font-medium">
                            {item.name || item.request_url}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {formatTimestamp(item.timestamp)}
                          </div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteRequest(item.request_id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 p-4">
          {/* Request URL bar */}
          <div className="flex mb-4 gap-2">
            <Select value={request.method} onValueChange={handleMethodChange}>
              <SelectTrigger className="w-24 bg-white dark:bg-gray-950">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={request.request_url}
              onChange={handleUrlChange}
              className="flex-1 bg-white dark:bg-gray-950"
              placeholder="Enter request URL"
            />

            <Button
              className="bg-black hover:bg-gray-800 text-white"
              onClick={makeRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
              ) : (
                <SendIcon className="h-4 w-4 mr-2" />
              )}
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
                    value={bodyInputValue}
                    onChange={handleBodyChange}
                    className="font-mono bg-white dark:bg-gray-950 min-h-32"
                    placeholder="Enter request body (JSON)"
                  />
                </TabsContent>
                <TabsContent value="params" className="mt-0">
                  {params.map((param, index) => (
                    <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                      <Input
                        placeholder="Key"
                        className="bg-white dark:bg-gray-950 col-span-2"
                        value={param.key}
                        onChange={(e) =>
                          updateParam(index, "key", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Value"
                        className="bg-white dark:bg-gray-950 col-span-2"
                        value={param.value}
                        onChange={(e) =>
                          updateParam(index, "value", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Description (optional)"
                        className="bg-white dark:bg-gray-950 col-span-2"
                        value={param.description}
                        onChange={(e) =>
                          updateParam(index, "description", e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="col-span-1"
                        onClick={() => removeParam(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={addParam}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Parameter
                  </Button>
                </TabsContent>
                <TabsContent value="headers" className="mt-0">
                  {headerInputs.map((header, index) => (
                    <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                      <Input
                        placeholder="Key"
                        className="bg-white dark:bg-gray-950 col-span-2"
                        value={header.key}
                        onChange={(e) =>
                          updateHeader(index, "key", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Value"
                        className="bg-white dark:bg-gray-950 col-span-2"
                        value={header.value}
                        onChange={(e) =>
                          updateHeader(index, "value", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Description (optional)"
                        className="bg-white dark:bg-gray-950 col-span-2"
                        value={header.description}
                        onChange={(e) =>
                          updateHeader(index, "description", e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="col-span-1"
                        onClick={() => removeHeader(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={addHeader}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Header
                  </Button>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Response */}
          <Card>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="m-4">Response</CardTitle>
              {(request.response?.status ?? 0) > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    {request.response?.time_taken}ms
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      (request.response?.status ?? 0) < 300
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : (request.response?.status ?? 0) < 400
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : (request.response?.status ?? 0) < 500
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {request.response?.status} {request.response?.status_text}
                  </span>
                </div>
              )}
            </div>
            <Tabs defaultValue="response-body">
              <CardHeader>
                <TabsList className="grid grid-cols-3 w-64">
                  <TabsTrigger value="response-body">Body</TabsTrigger>
                  <TabsTrigger value="response-headers">Headers</TabsTrigger>
                  <TabsTrigger value="response-cookies">Cookies</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="response-body" className="mt-0">
                  <Textarea
                    value={request.response?.data_raw}
                    placeholder="Your Response Will Come here"
                    readOnly
                    className="font-mono bg-gray-50 dark:bg-gray-900 min-h-64"
                  />
                </TabsContent>
                <TabsContent value="response-headers" className="mt-0">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded min-h-64">
                    {request.response?.headers &&
                    Object.keys(request.response.headers).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(request.response.headers).map(
                          ([key, value], index) => (
                            <div key={index} className="contents">
                              <div className="font-medium">{key}</div>
                              <div className="text-gray-700 dark:text-gray-300">
                                {value}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">No headers available</div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="response-cookies" className="mt-0">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded min-h-64">
                    <div className="text-gray-500">
                      Cookie information not available
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4">Save Request</h3>
            <div className="mb-4">
              <Label htmlFor="request-name" className="block mb-2">
                Request Name
              </Label>
              <Input
                id="request-name"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="Enter a name for this request"
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={saveRequest}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
