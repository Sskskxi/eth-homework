"use client"; // This must be a client component to use hooks

import { useReadContract } from "wagmi";
import { counterABI, COUNTER_ADDRESS } from "@/constants/contract";

export function ContractReader() {
  const { data, isLoading, isError, error } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterABI,
    functionName: "getCount",
  });

  if (isLoading) return <div className="text-gray-500">Loading counter...</div>;
  if (isError)
    return <div className="text-red-500">Error: {error?.message}</div>;

  return (
    <section className="mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Contract State</h2>
      <p className="text-4xl font-mono text-blue-600">
        Current Count: {data?.toString() ?? "0"}
      </p>
    </section>
  );
}
