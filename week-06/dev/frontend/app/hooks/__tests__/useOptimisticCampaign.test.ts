import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { parseEther } from "viem";
import { useOptimisticCampaign } from "../useOptimisticCampaign";

const BASE_RAISED = parseEther("0.5");
const BASE_WITHDRAWN = false;

describe("useOptimisticCampaign", () => {
  // ── Initial state ────────────────────────────────────

  it("initializes with base raised and withdrawn values", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    expect(result.current.raised).toBe(BASE_RAISED);
    expect(result.current.withdrawn).toBe(false);
    expect(result.current.isPendingDonate).toBe(false);
    expect(result.current.isPendingWithdraw).toBe(false);
  });

  // ── Optimistic donate ────────────────────────────────

  it("applyOptimisticDonate: immediately increases raised amount", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticDonate("0.3"));

    expect(result.current.raised).toBe(BASE_RAISED + parseEther("0.3"));
    expect(result.current.isPendingDonate).toBe(true);
  });

  it("applyOptimisticDonate: stacks multiple donations before confirm", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticDonate("0.1"));
    act(() => result.current.applyOptimisticDonate("0.2"));

    expect(result.current.raised).toBe(
      BASE_RAISED + parseEther("0.1") + parseEther("0.2")
    );
  });

  // ── Optimistic withdraw ──────────────────────────────

  it("applyOptimisticWithdraw: immediately marks withdrawn=true", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticWithdraw());

    expect(result.current.withdrawn).toBe(true);
    expect(result.current.isPendingWithdraw).toBe(true);
  });

  // ── Revert (on tx error) ─────────────────────────────

  it("revertOptimistic: rolls back raised to base value", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticDonate("0.3"));
    act(() => result.current.revertOptimistic());

    expect(result.current.raised).toBe(BASE_RAISED);
    expect(result.current.isPendingDonate).toBe(false);
  });

  it("revertOptimistic: rolls back withdrawn to base value", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticWithdraw());
    act(() => result.current.revertOptimistic());

    expect(result.current.withdrawn).toBe(false);
    expect(result.current.isPendingWithdraw).toBe(false);
  });

  // ── Confirm (on tx success) ──────────────────────────

  it("confirmOptimistic: clears pending flags but keeps optimistic values", () => {
    const { result } = renderHook(() =>
      useOptimisticCampaign(BASE_RAISED, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticDonate("0.3"));
    act(() => result.current.confirmOptimistic());

    // Pending cleared
    expect(result.current.isPendingDonate).toBe(false);
    // Optimistic value stays until real refetch arrives
    expect(result.current.raised).toBe(BASE_RAISED + parseEther("0.3"));
  });

  // ── Sync on prop change (after refetch) ──────────────

  it("syncs raised when baseRaised prop changes (after chain refetch)", () => {
    const initialRaised = parseEther("0.5");
    let baseRaised = initialRaised;

    const { result, rerender } = renderHook(() =>
      useOptimisticCampaign(baseRaised, BASE_WITHDRAWN)
    );

    act(() => result.current.applyOptimisticDonate("0.3"));
    expect(result.current.raised).toBe(initialRaised + parseEther("0.3"));

    // Simulate chain refetch returning the real confirmed value
    baseRaised = parseEther("0.8");
    rerender();

    expect(result.current.raised).toBe(parseEther("0.8"));
    expect(result.current.isPendingDonate).toBe(false);
  });
});
