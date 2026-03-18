import { useState, useEffect } from "react";
import { parseEther } from "viem";

export type OptimisticState = {
  raised: bigint;
  withdrawn: boolean;
  isPendingDonate: boolean;
  isPendingWithdraw: boolean;
};

export type UseOptimisticCampaignReturn = OptimisticState & {
  applyOptimisticDonate: (ethAmount: string) => void;
  applyOptimisticWithdraw: () => void;
  revertOptimistic: () => void;
  confirmOptimistic: () => void;
};

/**
 * Manages optimistic UI state for a single campaign card.
 *
 * On donate/withdraw:
 *   1. Immediately update local display values (optimistic).
 *   2. Show a small "confirming" badge instead of blocking overlay.
 *   3. On chain confirmation → confirmOptimistic() resets pending flags.
 *   4. On error           → revertOptimistic() rolls back display values.
 */
export function useOptimisticCampaign(
  baseRaised: bigint,
  baseWithdrawn: boolean
): UseOptimisticCampaignReturn {
  const [raised, setRaised] = useState(baseRaised);
  const [withdrawn, setWithdrawn] = useState(baseWithdrawn);
  const [isPendingDonate, setIsPendingDonate] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);

  // Sync when real on-chain data arrives after refetch — also clears pending flags
  useEffect(() => {
    setRaised(baseRaised);
    setWithdrawn(baseWithdrawn);
    setIsPendingDonate(false);
    setIsPendingWithdraw(false);
  }, [baseRaised, baseWithdrawn]);

  function applyOptimisticDonate(ethAmount: string) {
    const wei = parseEther(ethAmount as `${number}`);
    setRaised((prev) => prev + wei);
    setIsPendingDonate(true);
  }

  function applyOptimisticWithdraw() {
    setWithdrawn(true);
    setIsPendingWithdraw(true);
  }

  function revertOptimistic() {
    setRaised(baseRaised);
    setWithdrawn(baseWithdrawn);
    setIsPendingDonate(false);
    setIsPendingWithdraw(false);
  }

  function confirmOptimistic() {
    setIsPendingDonate(false);
    setIsPendingWithdraw(false);
  }

  return {
    raised,
    withdrawn,
    isPendingDonate,
    isPendingWithdraw,
    applyOptimisticDonate,
    applyOptimisticWithdraw,
    revertOptimistic,
    confirmOptimistic,
  };
}