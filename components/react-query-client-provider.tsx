"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Create React Query client instance for server state management
const client = new QueryClient();

// Provider component to wrap app with React Query context
export default function ReactQueryClientProvider( {children} : {children: React.ReactNode}){
    return <QueryClientProvider client={client}> { children }</QueryClientProvider>
}
       
