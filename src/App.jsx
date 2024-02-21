import React, { useEffect, useState } from "react"
import Router from "./Router"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "react-query"
import { store } from "./Store"
import { PersistGate } from "redux-persist/integration/react"

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <QueryClientProvider client={queryClient}>
        <Router></Router>
      </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  )
}

export default App
