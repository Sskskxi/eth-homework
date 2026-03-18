# StudyFund — 학습자를 위한 크라우드펀딩 dApp

학생들이 필요한 학습 자원(과외, 교재, 소프트웨어 등)을 게시하면, 서포터들이 ETH로 직접 후원하는 온체인 크라우드펀딩 플랫폼입니다.

---

## 프로젝트 소개

### 무엇을 만들었나?

**StudyFund**는 학생의 학습 니즈와 후원자를 직접 연결하는 탈중앙화 펀딩 플랫폼입니다.

- 학생은 "AP Chemistry 과외가 필요합니다" 같은 펀딩 캠페인을 게시합니다.
- 누구나 활성 캠페인에 ETH를 후원할 수 있습니다.
- 마감일이 지나면 캠페인 생성자가 모인 ETH를 인출합니다.
- 모든 거래는 Sepolia 테스트넷 위 스마트 컨트랙트에 기록되어 투명하게 공개됩니다.

### 주요 기능

| 기능 | 설명 |
|---|---|
| 캠페인 생성 | 제목, 설명, 과목, 목표 금액, 기간 설정 |
| ETH 후원 | 활성 캠페인에 원하는 금액만큼 후원 |
| 자금 인출 | 마감 후 창작자가 모인 ETH 수령 |
| 지갑 연결 | MetaMask 연동 (RainbowKit) |
| 실시간 잔액 표시 | 연결된 지갑의 ETH 잔액 및 내 캠페인 수 표시 |
| 트랜잭션 히스토리 | 세션 내 트랜잭션 목록 + Etherscan 링크 |
| 낙관적 UI 업데이트 | 블록 컨펌 전 즉시 UI 반영 (12초 대기 없음) |

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| 스마트 컨트랙트 | Solidity 0.8.26, Foundry |
| 프론트엔드 | Next.js 16 (App Router), TypeScript |
| 지갑 연동 | wagmi v2, RainbowKit v2, viem |
| 테스트 | Foundry (21개 컨트랙트 테스트), Vitest (17개 훅 테스트) |
| 네트워크 | Ethereum Sepolia 테스트넷 |

---

## 배포된 컨트랙트 주소

| 네트워크 | 주소 |
|---|---|
| Sepolia | [`0x0BAe86a84C7F127AcCfA3F670f04e6c4bb17a41e`](https://sepolia.etherscan.io/address/0x0bae86a84c7f127accfa3f670f04e6c4bb17a41e) |

> Etherscan에서 소스코드 검증 완료 ✅

---

## 설치 및 실행 방법

### 사전 준비

- [Foundry](https://getfoundry.sh/) 설치
- [Node.js 20+](https://nodejs.org/) 및 [pnpm](https://pnpm.io/) 설치
- MetaMask 확장 프로그램 설치
- Sepolia 테스트 ETH ([faucet](https://sepoliafaucet.com))

### 1. 저장소 클론

```bash
git clone <repo-url>
cd week-06/dev
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 아래 값을 채웁니다:

```env
PRIVATE_KEY=0x...               # 배포자 지갑 프라이빗 키
SEPOLIA_RPC_URL=https://...     # Alchemy 또는 Infura Sepolia RPC
ETHERSCAN_API_KEY=...           # Etherscan API 키 (검증용)
```

```bash
# 프론트엔드 환경 변수
cp .env.example frontend/.env.local
# NEXT_PUBLIC_CONTRACT_ADDRESS 값을 배포 후 채워넣기
```

### 3. 스마트 컨트랙트 테스트

```bash
# week-06/dev/ 에서 실행
forge test -v
```

```
Ran 21 tests for test/StudyFund.t.sol:StudyFundTest
21 passed; 0 failed ✅
```

### 4. Sepolia 배포

```bash
source .env

forge script script/StudyFund.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv
```

출력된 컨트랙트 주소를 `frontend/.env.local`에 입력합니다:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 5. 프론트엔드 의존성 설치 및 실행

```bash
cd frontend
pnpm install
pnpm dev
# → http://localhost:3000
```

### 6. 프론트엔드 테스트

```bash
cd frontend
pnpm test
```

```
Test Files  2 passed
Tests       17 passed ✅
```

---

## 사용 방법

1. MetaMask를 **Sepolia 네트워크**로 설정 후 지갑 연결
2. 상단 상태바에서 내 ETH 잔액 및 캠페인 수 확인
3. **Browse requests** 버튼으로 활성 캠페인 목록 조회
4. 카드의 **Support this →** 버튼으로 ETH 금액 입력 후 후원
5. **Post a request** 버튼으로 새 캠페인 생성
6. 마감일 이후 내 캠페인 카드에서 **Withdraw funds** 버튼으로 자금 인출
7. 우측 하단 ⏱ 버튼으로 트랜잭션 히스토리 확인

---

## 프로젝트 구조

```
week-06/dev/
├── src/
│   └── StudyFund.sol           # 크라우드펀딩 스마트 컨트랙트
├── test/
│   └── StudyFund.t.sol         # Foundry 테스트 (21개)
├── script/
│   └── StudyFund.s.sol         # 배포 스크립트
├── frontend/
│   └── app/
│       ├── components/
│       │   ├── CampaignCard.tsx    # 캠페인 카드 + 후원 UI
│       │   ├── CampaignSkeleton.tsx# 로딩 스켈레톤
│       │   ├── CreateModal.tsx     # 캠페인 생성 모달
│       │   ├── TxHistoryPanel.tsx  # 트랜잭션 히스토리 패널
│       │   └── UserStatusBar.tsx   # 지갑 잔액 + 상태 표시
│       ├── hooks/
│       │   ├── useOptimisticCampaign.ts  # 낙관적 UI 상태 관리
│       │   └── useTxHistory.ts           # 트랜잭션 히스토리
│       ├── config/
│       │   ├── wagmi.ts            # wagmi 설정
│       │   └── contract.ts         # 컨트랙트 주소 + ABI
│       └── page.tsx                # 메인 페이지
├── .env.example
└── foundry.toml
```

---

## 스마트 컨트랙트 주요 함수

| 함수 | 설명 |
|---|---|
| `createCampaign(title, description, subject, goal, durationDays)` | 새 펀딩 캠페인 생성 |
| `donate(campaignId)` payable | 활성 캠페인에 ETH 후원 |
| `withdraw(campaignId)` | 마감 후 모인 ETH 인출 |
| `getCampaigns()` | 전체 캠페인 조회 |
| `getCampaign(id)` | 단일 캠페인 조회 |

**보안:** CEI (Checks-Effects-Interactions) 패턴 + 재진입 방지 뮤텍스 적용

---

## 스크린샷

> 배포 후 실제 Sepolia 환경에서 촬영한 스크린샷 또는 데모 영상을 첨부하세요.

**Etherscan 컨트랙트 검증:**
[https://sepolia.etherscan.io/address/0x0bae86a84c7f127accfa3f670f04e6c4bb17a41e](https://sepolia.etherscan.io/address/0x0bae86a84c7f127accfa3f670f04e6c4bb17a41e)

---

## 체크리스트

전체 제출 체크리스트는 [CHECKLIST.md](./CHECKLIST.md)를 참고하세요.

---

🤖 Built with [Claude Code](https://claude.ai/claude-code)
