import { QueryClient, QueryKey } from "@tanstack/react-query";

const baseURL = "/api";

// Default fetcher function for queries
async function queryFn({ queryKey }: { queryKey: QueryKey }) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${queryKey[0]}`, { headers });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// API request function for mutations
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});