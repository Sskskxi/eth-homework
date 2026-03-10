'use client';

import { useState } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, isAddress } from 'viem';

export function EthTransfer() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');

  const { sendTransaction, data: hash, isPending, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function validate(): boolean {
    if (!isAddress(to)) {
      setValidationError('올바른 이더리움 주소를 입력하세요.');
      return false;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setValidationError('0보다 큰 금액을 입력하세요.');
      return false;
    }
    setValidationError('');
    return true;
  }

  function handleSend() {
    if (!validate()) return;
    sendTransaction({ to: to as `0x${string}`, value: parseEther(amount) });
  }

  return (
    <div className="p-4 bg-white border rounded space-y-3">
      <p className="font-medium">ETH 전송</p>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="받는 주소 (0x...)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="금액 (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.001"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      {validationError && (
        <p className="text-sm text-red-500">{validationError}</p>
      )}

      <button
        onClick={handleSend}
        disabled={isPending || isConfirming}
        className="w-full bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? '지갑 서명 대기 중...' : isConfirming ? '트랜잭션 확인 중...' : '전송'}
      </button>

      {isSuccess && hash && (
        <div className="text-sm text-green-600 space-y-1">
          <p>전송 완료!</p>
          <p className="break-all text-xs text-gray-500">Tx: {hash}</p>
        </div>
      )}

      {sendError && (
        <p className="text-sm text-red-500">오류: {sendError.message}</p>
      )}
    </div>
  );
}