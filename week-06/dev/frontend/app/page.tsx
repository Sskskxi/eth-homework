"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { STUDY_FUND_ADDRESS, STUDY_FUND_ABI } from "./config/contract";
import { MOCK_CAMPAIGNS, type Campaign } from "./config/mockData";
import CampaignCard from "./components/CampaignCard";
import CreateModal from "./components/CreateModal";
import CampaignSkeleton from "./components/CampaignSkeleton";
import UserStatusBar from "./components/UserStatusBar";
import TxHistoryPanel from "./components/TxHistoryPanel";
import { useTxHistory } from "./hooks/useTxHistory";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const isContractDeployed = STUDY_FUND_ADDRESS !== ZERO_ADDRESS;

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const { address } = useAccount();
  const txHistory = useTxHistory();

  const {
    data: onChainCampaigns,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: STUDY_FUND_ADDRESS,
    abi: STUDY_FUND_ABI,
    functionName: "getCampaigns",
    query: { enabled: isContractDeployed },
  });

  const liveCampaigns = (onChainCampaigns as Campaign[] | undefined)
    ?.filter((c) => !c.withdrawn) ?? [];

  const campaigns = isContractDeployed ? liveCampaigns : MOCK_CAMPAIGNS;
  const isMock = !isContractDeployed;

  // Count campaigns created by connected wallet
  const myCampaignCount = address
    ? liveCampaigns.filter(
        (c) => c.creator.toLowerCase() === address.toLowerCase()
      ).length
    : 0;

  return (
    <>
      {/* ── Nav ── */}
      <nav className="nav">
        <div className="logo">
          study<span>fund</span>
        </div>
        <ul className="nav-links">
          <li><a href="#campaigns">Browse</a></li>
          <li><a href="#how">How it works</a></li>
        </ul>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
          <button className="nav-cta" onClick={() => setShowModal(true)}>
            Post a request
          </button>
        </div>
      </nav>

      {/* ── User status bar (balance + campaign count) ── */}
      <UserStatusBar campaignCount={myCampaignCount} />

      {/* ── Mock data banner ── */}
      {isMock && (
        <div className="dev-banner">
          <strong>Preview mode</strong> — showing sample campaigns.
          Deploy the contract and set <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> to go live.
        </div>
      )}

      {/* ── Hero ── */}
      <section className="hero">
        <div>
          <p className="hero-eyebrow">Crowdfunding for learners</p>
          <h1 className="hero-title">
            Fund the homework <em>that matters</em>
          </h1>
          <p className="hero-sub">
            Students post their learning needs — tutors, supplies, software —
            and supporters make it happen with ETH. Transparent, on-chain,
            no fluff.
          </p>
          <div className="hero-btns">
            <button
              className="btn-primary"
              onClick={() =>
                document.getElementById("campaigns")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse requests
            </button>
            <button className="btn-secondary" onClick={() => setShowModal(true)}>
              Post yours →
            </button>
          </div>
        </div>

        {campaigns.length > 0 ? (
          <HeroCampaignCard campaign={campaigns[0]} />
        ) : (
          <HeroPlaceholder onPost={() => setShowModal(true)} />
        )}
      </section>

      {/* ── Campaigns grid ── */}
      <section className="cards-section" id="campaigns">
        <p className="section-label">
          {isMock ? "Sample requests (preview)" : "Active requests"}
        </p>

        {/* Network error banner */}
        {isContractDeployed && error && (
          <div className="error-banner">
            Could not load campaigns — make sure your wallet is on Sepolia.
          </div>
        )}

        {/* Skeleton grid while loading */}
        {isContractDeployed && isLoading && (
          <div className="cards-grid">
            {[1, 2, 3].map((i) => <CampaignSkeleton key={i} />)}
          </div>
        )}

        {!isLoading && campaigns.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--c-muted)", padding: "40px 0" }}>
            No active campaigns yet. Be the first to post a request!
          </p>
        )}

        {!isLoading && campaigns.length > 0 && (
          <div className="cards-grid">
            {campaigns.map((c) => (
              <CampaignCard
                key={c.id.toString()}
                campaign={c}
                onRefresh={isContractDeployed ? refetch : undefined}
                isMock={isMock}
                onTxSubmitted={(hash, type, label) => txHistory.addTx(hash, type, label)}
                onTxConfirmed={(hash) => txHistory.confirmTx(hash)}
                onTxFailed={(hash) => txHistory.failTx(hash)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA strip ── */}
      <div className="cta-strip" id="how">
        <div>
          <div className="cta-title">
            Are you a student? <em>Post your request.</em>
          </div>
          <div className="cta-sub">
            It takes 3 minutes — describe what you need, set an ETH goal, and
            let the community fund it on-chain.
          </div>
        </div>
        <button className="btn-light" onClick={() => setShowModal(true)}>
          Get started
        </button>
      </div>

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreated={() => refetch()}
          onTxSubmitted={(hash, label) => txHistory.addTx(hash, "createCampaign", label)}
          onTxConfirmed={(hash) => txHistory.confirmTx(hash)}
          onTxFailed={(hash) => txHistory.failTx(hash)}
        />
      )}

      {/* ── Floating tx history panel ── */}
      <TxHistoryPanel txs={txHistory.txs} />
    </>
  );
}

// ── Sub-components ──────────────────────────────────────

function HeroCampaignCard({ campaign }: { campaign: Campaign }) {
  const now = Math.floor(Date.now() / 1000);
  const daysLeft = Math.max(0, Math.ceil((Number(campaign.deadline) - now) / 86400));
  const pct =
    campaign.goal === 0n
      ? 0
      : Math.min(100, Math.round((Number(campaign.raised) * 100) / Number(campaign.goal)));

  return (
    <div className="hero-card">
      <div className="hero-card-title">{campaign.title}</div>
      <div className="hero-card-sub">
        by {campaign.creator.slice(0, 6)}…{campaign.creator.slice(-4)} · {campaign.subject}
      </div>
      <div className="progress-label">
        <span>{pct}% funded</span>
        <span style={{ color: "var(--c-muted)" }}>
          {(Number(campaign.raised) / 1e18).toFixed(3)} / {(Number(campaign.goal) / 1e18).toFixed(3)} ETH
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="tags-row">
        <span className="tag">{campaign.subject}</span>
        <span className="tag">{daysLeft} days left</span>
      </div>
    </div>
  );
}

function HeroPlaceholder({ onPost }: { onPost: () => void }) {
  return (
    <div className="hero-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", minHeight: "180px" }}>
      <p style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "var(--c-muted)", textAlign: "center" }}>
        No campaigns yet
      </p>
      <p style={{ fontSize: "13px", color: "var(--c-muted)", textAlign: "center" }}>
        Connect your wallet and post the first request.
      </p>
      <button className="btn-primary" onClick={onPost}>Post a request</button>
    </div>
  );
}
