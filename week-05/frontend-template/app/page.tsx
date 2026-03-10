import { WalletConnect } from '@/components/WalletConnect';
import { EthTransfer } from '@/components/EthTransfer';

// ============================================================
// 메인 페이지
// ============================================================
// 이 페이지는 서버 컴포넌트입니다.
// 클라이언트 전용 기능(지갑 연결 등)은 WalletConnect 컴포넌트에서 처리합니다.
export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Bay-17th dApp</h1>

      {/* 지갑 연결 컴포넌트 */}
      <WalletConnect />

      {/* ETH 전송 컴포넌트 */}
      <div className="mt-4">
        <EthTransfer />
      </div>
    </main>
  );
}
