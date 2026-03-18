"use client";

import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { STUDY_FUND_ADDRESS, STUDY_FUND_ABI } from "../config/contract";
import { useOptimisticCampaign } from "../hooks/useOptimisticCampaign";
import type { TxType } from "../hooks/useTxHistory";

type Campaign = {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  subject: string;
  goal: bigint;
  raised: bigint;
  deadline: bigint;
  withdrawn: boolean;
};

const SUBJECT_EMOJI: Record<string, string> = {
  Math: "📐",
  Biology: "🧬",
  Writing: "✍️",
  Chemistry: "⚗️",
  Physics: "🔭",
  History: "📚",
  Art: "🎨",
  Music: "🎵",
  Programming: "💻",
  English: "📝",
};

const SUBJECT_ACCENT: Record<string, { bar: string; text: string; bg: string }> = {
  Math:       { bar: "#ef9f27", text: "#ba7517", bg: "#fdf3e0" },
  Biology:    { bar: "#1d9e75", text: "#0f6e56", bg: "#e1f5ee" },
  Writing:    { bar: "#d4537e", text: "#993556", bg: "#fbeaf0" },
  Chemistry:  { bar: "#6b8cde", text: "#3a5cb8", bg: "#edf1fc" },
  Physics:    { bar: "#9b67cc", text: "#6a3a9e", bg: "#f3edfb" },
  History:    { bar: "#e07b39", text: "#b05818", bg: "#fdf0e6" },
  Art:        { bar: "#e97777", text: "#c04040", bg: "#fef0f0" },
  Music:      { bar: "#2bc0b4", text: "#1a8980", bg: "#e4f9f7" },
  Programming:{ bar: "#34b36b", text: "#1e7c47", bg: "#e3f9ed" },
  English:    { bar: "#8c8c8c", text: "#555555", bg: "#f5f5f5" },
};

function daysLeft(deadlineTs: bigint): number {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(deadlineTs) - now;
  return Math.max(0, Math.ceil(diff / 86400));
}

function pct(raised: bigint, goal: bigint): number {
  if (goal === 0n) return 0;
  return Math.min(100, Math.round((Number(raised) * 100) / Number(goal)));
}

export default function CampaignCard({
  campaign,
  onRefresh,
  onTxSubmitted,
  onTxConfirmed,
  onTxFailed,
}: {
  campaign: Campaign;
  onRefresh?: () => void;
  isMock?: boolean;
  onTxSubmitted?: (hash: `0x${string}`, type: TxType, label: string) => void;
  onTxConfirmed?: (hash: `0x${string}`) => void;
  onTxFailed?: (hash: `0x${string}`) => void;
}) {
  const { address } = useAccount();
  const [donationInput, setDonationInput] = useState("");
  const [showDonate, setShowDonate] = useState(false);

  const optimistic = useOptimisticCampaign(campaign.raised, campaign.withdrawn);

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && txHash) {
      setDonationInput("");
      setShowDonate(false);
      optimistic.confirmOptimistic();
      onTxConfirmed?.(txHash);
      onRefresh?.();
    }
  }, [isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error && txHash) {
      optimistic.revertOptimistic();
      onTxFailed?.(txHash);
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCreator = address?.toLowerCase() === campaign.creator.toLowerCase();
  const isExpired = daysLeft(campaign.deadline) === 0;
  // Use optimistic values for display
  const percent = pct(optimistic.raised, campaign.goal);
  const accent = SUBJECT_ACCENT[campaign.subject] ?? SUBJECT_ACCENT["Math"];
  const emoji = SUBJECT_EMOJI[campaign.subject] ?? "📖";
  const isConfirmingTx = isPending || isConfirming;

  function handleDonate() {
    if (!donationInput || Number(donationInput) <= 0) return;
    const amount = donationInput;
    optimistic.applyOptimisticDonate(amount);
    setShowDonate(false);
    writeContract(
      {
        address: STUDY_FUND_ADDRESS,
        abi: STUDY_FUND_ABI,
        functionName: "donate",
        args: [campaign.id],
        value: parseEther(amount),
      },
      {
        onSuccess: (hash) =>
          onTxSubmitted?.(hash, "donate", `Donate ${amount} ETH → ${campaign.title}`),
      }
    );
  }

  function handleWithdraw() {
    optimistic.applyOptimisticWithdraw();
    writeContract(
      {
        address: STUDY_FUND_ADDRESS,
        abi: STUDY_FUND_ABI,
        functionName: "withdraw",
        args: [campaign.id],
      },
      {
        onSuccess: (hash) =>
          onTxSubmitted?.(hash, "withdraw", `Withdraw from ${campaign.title}`),
      }
    );
  }

  return (
    <div className="project-card" style={{ position: "relative" }}>
      <div className="card-img" style={{ background: accent.bg }}>
        {emoji}
      </div>
      <div className="card-body">
        <div className="card-subject">{campaign.subject}</div>
        <div className="card-name">{campaign.title}</div>
        <div className="card-desc">{campaign.description}</div>
        <div className="card-progress-wrap">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: accent.text, fontWeight: 500 }}>
              {percent}% funded
            </span>
            <span style={{ fontSize: "11px", color: "var(--c-muted)" }}>
              {isExpired ? "Ended" : `${daysLeft(campaign.deadline)} days left`}
            </span>
          </div>
          <div className="card-progress-bar">
            <div
              className="card-progress-fill"
              style={{ width: `${percent}%`, background: accent.bar }}
            />
          </div>
        </div>
        <div className="card-foot">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="card-amount">{formatEther(optimistic.raised)} ETH</span>{" "}
            <span className="card-goal">of {formatEther(campaign.goal)} ETH</span>
            {/* Inline confirming badge — non-blocking */}
            {isConfirmingTx && (
              <span style={{
                fontSize: "10px",
                color: "#7c5cfc",
                background: "#f0ebff",
                borderRadius: "4px",
                padding: "2px 6px",
                fontWeight: 600,
              }}>
                {isPending ? "sign…" : "confirming…"}
              </span>
            )}
          </div>
        </div>

        {/* Donate section */}
        {!isExpired && !optimistic.withdrawn && (
          <div style={{ marginTop: "12px" }}>
            {showDonate ? (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="ETH amount"
                  value={donationInput}
                  onChange={(e) => setDonationInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(0,0,0,0.15)",
                    fontSize: "13px",
                    fontFamily: "DM Sans, sans-serif",
                    outline: "none",
                  }}
                />
                <button className="btn-donate" onClick={handleDonate}>
                  Give
                </button>
                <button
                  className="btn-donate-cancel"
                  onClick={() => setShowDonate(false)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button className="btn-support" onClick={() => setShowDonate(true)}>
                Support this →
              </button>
            )}
          </div>
        )}

        {/* Creator withdraw */}
        {isCreator && isExpired && !optimistic.withdrawn && campaign.raised > 0n && (
          <button
            className="btn-withdraw"
            onClick={handleWithdraw}
            disabled={optimistic.isPendingWithdraw}
            style={{ marginTop: "10px" }}
          >
            Withdraw funds
          </button>
        )}

        {/* Status messages */}
        {error && (
          <p style={{ color: "#c0392b", fontSize: "12px", marginTop: "8px" }}>
            {error.message.slice(0, 80)}
          </p>
        )}
        {optimistic.withdrawn && (
          <p style={{ color: "var(--c-muted)", fontSize: "12px", marginTop: "8px" }}>
            Funds withdrawn by creator.
          </p>
        )}
      </div>
    </div>
  );
}
