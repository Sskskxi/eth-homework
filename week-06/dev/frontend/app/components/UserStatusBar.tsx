"use client";

import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

export default function UserStatusBar({
  campaignCount,
}: {
  campaignCount: number;
}) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected || !address) return null;

  const ethBalance = balance ? Number(formatEther(balance.value)).toFixed(4) : "—";

  return (
    <div className="user-status-bar">
      <span className="user-status-item">
        <span className="user-status-label">Balance</span>
        <span className="user-status-value">{ethBalance} ETH</span>
      </span>
      <span className="user-status-divider" />
      <span className="user-status-item">
        <span className="user-status-label">Your campaigns</span>
        <span className="user-status-value">{campaignCount}</span>
      </span>
    </div>
  );
}
