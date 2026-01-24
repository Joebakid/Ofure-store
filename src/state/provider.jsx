"use client";

import AppProvider from "./context/provider";

export default function Providers({ children }) {
  return <AppProvider>{children}</AppProvider>;
}