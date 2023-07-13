import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { initQueryClient } from "@ts-rest/react-query"
import App from "./App.tsx"
import { contract } from "contract"
import "./index.css"

export const client = initQueryClient(
  contract,
  { baseUrl: "http://localhost:9000/api", baseHeaders: {} },
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
)
