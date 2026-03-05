'use client';

// ============================================================
// 학습 목표 체크리스트
// ============================================================
// [✅] wagmi의 핵심 개념(hooks, config, provider) → layout.tsx + config/wagmi.ts
// [✅] useAccount, useBalance → WalletConnect 컴포넌트
// [✅] useReadContract → getCount 조회
// [✅] useWriteContract → increment / decrement 호출
// [✅] BigInt & viem 유틸리티 → formatUnits, BigInt 비교/연산
// ============================================================

import { WalletConnect } from "@/components/WalletConnect";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect } from "react";
import { COUNTER_ADDRESS, counterABI } from "@/constants/contract";

// ============================================================
// [BigInt & viem] viem의 유틸리티 함수 import
// ============================================================
// formatUnits: BigInt 값을 소수점 단위로 포맷 (예: formatUnits(1000000n, 6) → "1.0")
// formatEther: wei(BigInt)를 ETH 문자열로 변환 (= formatUnits(v, 18))
// parseEther: ETH 문자열을 wei(BigInt)로 변환
import { formatUnits, formatEther, parseEther } from "viem";

export default function Home() {
  // ============================================================
  // [useReadContract] 컨트랙트 상태 읽기
  // ============================================================
  // - address: 컨트랙트 주소
  // - abi: 컨트랙트 ABI (as const로 타입 추론 활성화)
  // - functionName: 호출할 view 함수명
  // - 반환값 data는 uint256 → JavaScript BigInt 타입
  const { data: count, refetch } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterABI,
    functionName: "getCount",
  });

  // ============================================================
  // [useWriteContract] 컨트랙트 상태 변경
  // ============================================================
  // - writeContract(): 실제 트랜잭션을 지갑에 요청
  // - data(hash): 서명 완료 후 반환되는 tx 해시 (0x...)
  // - isPending: 지갑 서명 대기 중
  // - error: 서명 거부 또는 호출 오류
  const {
    data: hash,
    writeContract,
    isPending: isSigning,
    error: writeError,
  } = useWriteContract();

  // ============================================================
  // [useWaitForTransactionReceipt] 트랜잭션 채굴 대기
  // ============================================================
  // - hash가 있을 때만 자동으로 polling 시작
  // - isLoading: 블록 확인 대기 중 (Pending)
  // - isSuccess: 블록에 포함(채굴) 완료
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // 트랜잭션 성공 시 카운터 값 재조회
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  // ============================================================
  // [BigInt] BigInt 유틸리티 활용
  // ============================================================
  // count는 uint256 반환값 → BigInt 타입
  // BigInt 리터럴은 숫자 뒤에 'n'을 붙임: 0n, 100n
  const countBigInt = count ?? 0n;                    // nullish coalescing with BigInt
  const isZero = countBigInt === 0n;                  // BigInt 동등 비교
  const isLarge = countBigInt > 100n;                 // BigInt 크기 비교
  const doubled = countBigInt * 2n;                   // BigInt 산술 연산

  // formatUnits: 단위 변환 (counter는 소수점 없으므로 decimals = 0)
  const formattedCount = formatUnits(countBigInt, 0);

  // parseEther / formatEther 시연: "1.5" ETH ↔ wei(BigInt)
  const exampleWei = parseEther("1.5");               // 1500000000000000000n
  const exampleEth = formatEther(exampleWei);         // "1.5"

  // ============================================================
  // 핸들러: useWriteContract 호출
  // ============================================================
  const handleIncrement = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: counterABI,
      functionName: "increment",
    });
  };

  const handleDecrement = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: counterABI,
      functionName: "decrement",
    });
  };

  return (
    <main className="min-h-screen p-8 bg-slate-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Counter dApp</h1>

        {/* ============================================================
            WalletConnect: useAccount + useBalance 시연
            ============================================================ */}
        <WalletConnect />

        {/* ============================================================
            Counter: useReadContract + useWriteContract 시연
            ============================================================ */}
        <div className="p-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Counter Interaction
          </h2>

          {/* 현재 카운트 표시 */}
          <div className="mb-4">
            <span className="text-sm text-slate-500 uppercase tracking-wider">
              Current Count
            </span>
            <div className="text-5xl font-mono font-bold text-blue-600">
              {count !== undefined ? count.toString() : "---"}
            </div>
          </div>

          {/* ============================================================
              BigInt & viem 유틸리티 시연 패널
              ============================================================ */}
          <div className="mb-6 p-4 bg-slate-100 rounded-lg text-sm text-slate-600 space-y-1 font-mono">
            <p className="font-semibold text-slate-700 font-sans mb-2">
              BigInt & viem 유틸리티
            </p>
            <p>count (BigInt 원시값): <span className="text-blue-700">{countBigInt.toString()}n</span></p>
            <p>formatUnits(count, 0): <span className="text-blue-700">"{formattedCount}"</span></p>
            <p>count * 2n: <span className="text-blue-700">{doubled.toString()}n</span></p>
            <p>count === 0n: <span className="text-purple-600">{isZero.toString()}</span></p>
            <p>count &gt; 100n: <span className="text-purple-600">{isLarge.toString()}</span></p>
            <p className="border-t border-slate-200 pt-1 mt-1">
              parseEther("1.5"): <span className="text-green-700">{exampleWei.toString()}n</span>
            </p>
            <p>formatEther(parseEther("1.5")): <span className="text-green-700">"{exampleEth}"</span></p>
          </div>

          {/* 트랜잭션 버튼 */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleIncrement}
              disabled={isSigning || isConfirming}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            >
              Increment
            </button>
            <button
              onClick={handleDecrement}
              disabled={isSigning || isConfirming || isZero}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-slate-300 transition-colors"
            >
              Decrement
            </button>
          </div>

          {/* 트랜잭션 상태 */}
          <div className="mt-4 text-sm font-medium">
            {isSigning && (
              <p className="text-amber-600 animate-pulse">
                ● 지갑에서 서명을 대기 중입니다...
              </p>
            )}
            {isConfirming && (
              <p className="text-blue-500">
                <span className="inline-block animate-spin mr-2">↻</span>
                네트워크에서 확인 중 (Pending)...
              </p>
            )}
            {isSuccess && (
              <p className="text-green-600">
                ✓ 트랜잭션 성공! 값이 업데이트되었습니다.
              </p>
            )}
            {writeError && (
              <p className="text-red-500">⚠ 에러: {writeError.message}</p>
            )}
            {hash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                className="text-xs text-slate-400 underline mt-2 block"
              >
                Etherscan에서 보기 →
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}