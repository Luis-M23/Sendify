"use client"

import React from "react"
import { ToastContainer } from "react-toastify"
import { useTheme } from "@/components/theme-provider"
import "react-toastify/dist/ReactToastify.css"

export function ThemedToastContainer() {
  const { theme } = useTheme()

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  )
}
