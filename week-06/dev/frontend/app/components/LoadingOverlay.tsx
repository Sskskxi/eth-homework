"use client";

type Props = {
  message?: string;
};

export default function LoadingOverlay({ message = "Loading…" }: Props) {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-spinner" />
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}
