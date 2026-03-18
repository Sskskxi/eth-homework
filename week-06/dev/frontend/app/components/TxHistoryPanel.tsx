"use client";

import { useState } from "react";
import type { TxRecord } from "../hooks/useTxHistory";

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx";

const TYPE_LABEL: Record<string, string> = {
  donate: "Donated",
  createCampaign: "Created campaign",
  withdraw: "Withdrew",
};

const STATUS_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
  pending:   { color: "#7c5cfc", bg: "#f0ebff", dot: "🔵" },
  confirmed: { color: "#2e7d52", bg: "#e8f5ed", dot: "🟢" },
  failed:    { color: "#c0392b", bg: "#fdecea", dot: "🔴" },
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function TxHistoryPanel({ txs }: { txs: TxRecord[] }) {
  const [open, setOpen] = useState(false);

  const pendingCount = txs.filter((t) => t.status === "pending").length;

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="tx-history-trigger"
        onClick={() => setOpen((v) => !v)}
        title="Transaction history"
      >
        {pendingCount > 0 && (
          <span className="tx-badge">{pendingCount}</span>
        )}
        ⏱
      </button>

      {/* Slide-in panel */}
      {open && (
        <div className="tx-panel">
          <div className="tx-panel-header">
            <span>Recent transactions</span>
            <button className="tx-panel-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {txs.length === 0 ? (
            <p className="tx-empty">No transactions yet in this session.</p>
          ) : (
            <ul className="tx-list">
              {txs.map((tx) => {
                const style = STATUS_STYLE[tx.status];
                return (
                  <li key={tx.hash} className="tx-item">
                    <div className="tx-item-top">
                      <span className="tx-type">{TYPE_LABEL[tx.type] ?? tx.type}</span>
                      <span
                        className="tx-status-badge"
                        style={{ color: style.color, background: style.bg }}
                      >
                        {style.dot} {tx.status}
                      </span>
                    </div>
                    <div className="tx-item-label">{tx.label}</div>
                    <div className="tx-item-bottom">
                      <span className="tx-time">{timeAgo(tx.timestamp)}</span>
                      <a
                        href={`${SEPOLIA_EXPLORER}/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="tx-link"
                      >
                        Etherscan ↗
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
