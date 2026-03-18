"use client";

import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { STUDY_FUND_ADDRESS, STUDY_FUND_ABI } from "../config/contract";
import LoadingOverlay from "./LoadingOverlay";

const SUBJECTS = [
  "Math", "Biology", "Writing", "Chemistry",
  "Physics", "History", "Art", "Music", "Programming", "English",
];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const isContractDeployed = STUDY_FUND_ADDRESS !== ZERO_ADDRESS;

type Props = {
  onClose: () => void;
  onCreated: () => void;
  onTxSubmitted?: (hash: `0x${string}`, label: string) => void;
  onTxConfirmed?: (hash: `0x${string}`) => void;
  onTxFailed?: (hash: `0x${string}`) => void;
};

export default function CreateModal({ onClose, onCreated, onTxSubmitted, onTxConfirmed, onTxFailed }: Props) {
  const { isConnected } = useAccount();
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "Math",
    goalEth: "",
    durationDays: "14",
  });
  const [validationError, setValidationError] = useState("");

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && txHash) {
      onTxConfirmed?.(txHash);
      onCreated();
      onClose();
    }
  }, [isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error && txHash) onTxFailed?.(txHash);
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  }

  function handleSubmit() {
    if (!form.title.trim()) return setValidationError("Title is required.");
    if (!form.goalEth || Number(form.goalEth) <= 0)
      return setValidationError("Goal must be greater than 0.");
    const days = Number(form.durationDays);
    if (!days || days < 1 || days > 365)
      return setValidationError("Duration must be between 1 and 365 days.");

    writeContract(
      {
        address: STUDY_FUND_ADDRESS,
        abi: STUDY_FUND_ABI,
        functionName: "createCampaign",
        args: [
          form.title,
          form.description,
          form.subject,
          parseEther(form.goalEth),
          BigInt(days),
        ],
      },
      {
        onSuccess: (hash) =>
          onTxSubmitted?.(hash, `Create campaign: ${form.title}`),
      }
    );
  }

  return (
    <>
      {(isPending || isConfirming) && (
        <LoadingOverlay
          message={isPending ? "Confirm in MetaMask…" : "Creating campaign…"}
        />
      )}
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="modal-title">Post a funding request</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {/* ── Guard: contract not deployed ── */}
        {!isContractDeployed && (
          <div className="modal-notice modal-notice--warn">
            <strong>Contract not deployed yet.</strong><br />
            Deploy to Sepolia (or Anvil) and set{" "}
            <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in{" "}
            <code>frontend/.env.local</code>, then restart the dev server.
          </div>
        )}

        {/* ── Guard: wallet not connected ── */}
        {!isConnected && (
          <div className="modal-notice modal-notice--info">
            <p style={{ marginBottom: "10px" }}>Connect your wallet to post a request.</p>
            <ConnectButton />
          </div>
        )}

        {/* ── Form (always visible so user can read it) ── */}
        <label className="modal-label">Title *</label>
        <input
          className="modal-input"
          placeholder="e.g. AP Chemistry tutoring sessions"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          disabled={!isConnected || !isContractDeployed}
        />

        <label className="modal-label">Description</label>
        <textarea
          className="modal-input modal-textarea"
          placeholder="Describe what you need and why…"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          disabled={!isConnected || !isContractDeployed}
        />

        <label className="modal-label">Subject</label>
        <select
          className="modal-input"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          disabled={!isConnected || !isContractDeployed}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="modal-label">Goal (ETH) *</label>
            <input
              className="modal-input"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={form.goalEth}
              onChange={(e) => update("goalEth", e.target.value)}
              disabled={!isConnected || !isContractDeployed}
            />
          </div>
          <div>
            <label className="modal-label">Duration (days) *</label>
            <input
              className="modal-input"
              type="number"
              min="1"
              max="365"
              placeholder="14"
              value={form.durationDays}
              onChange={(e) => update("durationDays", e.target.value)}
              disabled={!isConnected || !isContractDeployed}
            />
          </div>
        </div>

        {validationError && (
          <p className="modal-error">{validationError}</p>
        )}
        {error && (
          <p className="modal-error">
            {error.message.includes("0x")
              ? "Transaction failed — check your wallet is on the correct network."
              : error.message.slice(0, 120)}
          </p>
        )}

        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: "12px" }}
          onClick={handleSubmit}
          disabled={!isConnected || !isContractDeployed || isPending || isConfirming}
        >
          {!isConnected
            ? "Connect wallet first"
            : !isContractDeployed
            ? "Contract not deployed"
            : isPending
            ? "Confirm in wallet…"
            : isConfirming
            ? "Creating…"
            : "Create campaign"}
        </button>
      </div>
    </div>
    </>
  );
}
