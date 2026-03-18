import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTxHistory } from "../useTxHistory";

const HASH_A = "0xaaaa" as `0x${string}`;
const HASH_B = "0xbbbb" as `0x${string}`;

describe("useTxHistory", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // ── addTx ───────────────────────────────────────────

  it("starts with empty history", () => {
    const { result } = renderHook(() => useTxHistory());
    expect(result.current.txs).toHaveLength(0);
  });

  it("addTx: adds a pending record at the front", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => result.current.addTx(HASH_A, "donate", "Donate 0.1 ETH"));

    expect(result.current.txs).toHaveLength(1);
    expect(result.current.txs[0]).toMatchObject({
      hash: HASH_A,
      type: "donate",
      status: "pending",
      label: "Donate 0.1 ETH",
    });
  });

  it("addTx: newest tx appears first", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => result.current.addTx(HASH_A, "donate", "First"));
    act(() => result.current.addTx(HASH_B, "createCampaign", "Second"));

    expect(result.current.txs[0].hash).toBe(HASH_B);
    expect(result.current.txs[1].hash).toBe(HASH_A);
  });

  it("addTx: caps history at 10 entries", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => {
      for (let i = 0; i < 12; i++) {
        result.current.addTx(`0x${i.toString().padStart(4, "0")}` as `0x${string}`, "donate", `tx${i}`);
      }
    });

    expect(result.current.txs).toHaveLength(10);
  });

  // ── confirmTx ────────────────────────────────────────

  it("confirmTx: updates matching tx status to confirmed", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => result.current.addTx(HASH_A, "donate", "Donate"));
    act(() => result.current.confirmTx(HASH_A));

    expect(result.current.txs[0].status).toBe("confirmed");
  });

  it("confirmTx: does not affect other txs", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => {
      result.current.addTx(HASH_A, "donate", "First");
      result.current.addTx(HASH_B, "withdraw", "Second");
    });
    act(() => result.current.confirmTx(HASH_A));

    const hashBRecord = result.current.txs.find((t) => t.hash === HASH_B);
    expect(hashBRecord?.status).toBe("pending");
  });

  // ── failTx ───────────────────────────────────────────

  it("failTx: updates matching tx status to failed", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => result.current.addTx(HASH_A, "createCampaign", "Create"));
    act(() => result.current.failTx(HASH_A));

    expect(result.current.txs[0].status).toBe("failed");
  });

  // ── clearAll ─────────────────────────────────────────

  it("clearAll: empties the history", () => {
    const { result } = renderHook(() => useTxHistory());

    act(() => {
      result.current.addTx(HASH_A, "donate", "A");
      result.current.addTx(HASH_B, "withdraw", "B");
    });
    act(() => result.current.clearAll());

    expect(result.current.txs).toHaveLength(0);
  });

  // ── timestamp ────────────────────────────────────────

  it("addTx: records current timestamp", () => {
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));
    const { result } = renderHook(() => useTxHistory());

    act(() => result.current.addTx(HASH_A, "donate", "Donate"));

    expect(result.current.txs[0].timestamp).toBe(new Date("2025-01-01T12:00:00Z").getTime());
  });
});
