import { useState, useCallback } from "react";

export type TxType = "donate" | "createCampaign" | "withdraw";
export type TxStatus = "pending" | "confirmed" | "failed";

export type TxRecord = {
  hash: `0x${string}`;
  type: TxType;
  status: TxStatus;
  label: string;
  timestamp: number;
};

export type UseTxHistoryReturn = {
  txs: TxRecord[];
  addTx: (hash: `0x${string}`, type: TxType, label: string) => void;
  confirmTx: (hash: `0x${string}`) => void;
  failTx: (hash: `0x${string}`) => void;
  clearAll: () => void;
};

const MAX_HISTORY = 10;

export function useTxHistory(): UseTxHistoryReturn {
  const [txs, setTxs] = useState<TxRecord[]>([]);

  const addTx = useCallback(
    (hash: `0x${string}`, type: TxType, label: string) => {
      const record: TxRecord = {
        hash,
        type,
        status: "pending",
        label,
        timestamp: Date.now(),
      };
      setTxs((prev) => [record, ...prev].slice(0, MAX_HISTORY));
    },
    []
  );

  const confirmTx = useCallback((hash: `0x${string}`) => {
    setTxs((prev) =>
      prev.map((tx) => (tx.hash === hash ? { ...tx, status: "confirmed" } : tx))
    );
  }, []);

  const failTx = useCallback((hash: `0x${string}`) => {
    setTxs((prev) =>
      prev.map((tx) => (tx.hash === hash ? { ...tx, status: "failed" } : tx))
    );
  }, []);

  const clearAll = useCallback(() => setTxs([]), []);

  return { txs, addTx, confirmTx, failTx, clearAll };
}
