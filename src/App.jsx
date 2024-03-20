import React, { Suspense } from "react"
import Router from "./Router"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "react-query"
import { store } from "./Store"

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  )
}

export default App
