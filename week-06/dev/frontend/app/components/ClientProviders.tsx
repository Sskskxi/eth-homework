"use client";

import dynamic from "next/dynamic";

// Defer WalletConnect initialization to the browser only.
// indexedDB / localStorage are not available on the server.
const Providers = dynamic(() => import("./Providers"), { ssr: false });

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
