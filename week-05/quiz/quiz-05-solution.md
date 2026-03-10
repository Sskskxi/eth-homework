# Week 5 Quiz: PoS/Consensus + RainbowKit

> **제출 방법:** 이 파일을 복사하여 답변을 작성한 후, PR로 제출하세요.
> **평가 기준:** 개념 이해도 중심 - 문법 오류보다 논리적 설명을 중시합니다.

---

## 문제 1: PoS 개념 (객관식)

이더리움이 PoW(작업 증명)에서 PoS(지분 증명)로 전환한 **가장 주요한 이유**는 무엇인가요?

**보기:**
A) 트랜잭션 처리 속도를 10배 이상 높이기 위해
B) 에너지 소비를 99.95% 이상 줄이고 환경 친화적으로 만들기 위해
C) 블록 크기를 늘려서 더 많은 데이터를 저장하기 위해
D) 채굴 장비 없이도 누구나 블록을 생성할 수 있게 하기 위해

**답변:**

<!--
정답 알파벳과 왜 이 답을 선택했는지 설명하세요.
PoW의 문제점과 PoS의 해결책을 연결지어 설명하면 더 좋습니다.
-->

B
PoW의 문제점은 정답을 맞추지 못한 나머지 채굴자들의 연산은 전부 낭비된다는 것이다.
PoS의 해결책은 ETH를 스테이킹한 검증자 중 무작위로 1명을 선택해 블록을 생성하게 하여 경쟁 자체가 없으므로 불필요한 연산들이 사라지게 된다.

---

## 문제 2: 검증자 역할 (객관식)

이더리움 PoS에서 검증자(Validator)가 수행하는 **두 가지 주요 역할**은 무엇인가요?

**보기:**
A) 블록 채굴(Mining)과 가스 가격 결정
B) 블록 제안(Proposing)과 블록 증명(Attesting)
C) 트랜잭션 전송과 수수료 수집
D) 스마트 컨트랙트 배포와 실행

**답변:**

<!--
정답 알파벳과 각 역할이 무엇을 의미하는지 설명하세요.
-->

B : 새로운 블록 제안과 다른 검증자가 제안한 블록이 유효한지 증명하는 역할을 한다.
C : 사용자가 전송한 트랜잭션을 수집하고 블록에 포함시키는 역할을 수행하며 그 과정에서 수수료를 획득한다.

---

## 문제 3: 왜 PoW에서 PoS로? (단답형)

PoW(작업 증명)와 PoS(지분 증명)의 **핵심 차이점**은 무엇인가요?
"자격 증명 방식"과 "보안 보장 방식" 두 관점에서 각각 비교하세요.

**답변:**

<!--
자격 증명 방식:
- PoW:
- PoS:

보안 보장 방식:
- PoW:
- PoS:
-->

자격 증명 방식:

- PoW: 복잡한 수학 문제를 가장 먼저 푼 채굴자에게 블록 생성 자격을 부여함.
- PoS: 일정량의 ETH를 스테이킹한 검증자에게 블록 생성 자격을 부여함.

보안 보장 방식:

- PoW: 블록 생성 경쟁을 통해 네트워크의 보안을 유지함.
- PoS: 스테이킹된 ETH의 양에 따라 블록 생성 확률이 결정되므로, 공격자가 네트워크를 공격하려면 막대한 양의 ETH를 스테이킹해야 함.

---

## 문제 4: 슬래싱의 목적 (단답형)

슬래싱(Slashing)은 검증자의 스테이킹된 ETH를 **강제로 소각**하는 패널티입니다.

1. 슬래싱이 발동되는 **두 가지 조건**은 무엇인가요?
2. **왜** 이런 처벌이 필요한가요? 없다면 어떤 문제가 생길 수 있나요?

**답변:**

<!--
1) 슬래싱 조건 (2가지):
   -
   -

2) 슬래싱이 필요한 이유:

-->

1. 슬래싱 조건 (2가지):
   - 이중 투표 : 같은 슬롯에서 두 개의 서로 다른 블록에 동시에 서명하는 행위
   - 이중 제안 / 서라운드 투표 : 동일한 슬롯에서 서로 다른 블록을 제안하거나, 이전에 제출한 attestation과 충돌하거나 이를 둘러싸는 형태로 다시 투표하는 행위 

2. 슬래싱이 필요한 이유:
   슬래싱이 없다면 검증자들은 네트워크 규칙을 위반해도 아무런 패널티가 없기 때문에, 악의적인 행동을 할 유인이 생긴다. 이는 네트워크의 보안을 심각하게 위협할 수 있음.

---

## 문제 5: 체인 선택 규칙 (단답형)

여러 유효한 블록이 동시에 제안되면 **포크(Fork)**가 발생합니다.
이더리움의 LMD-GHOST(Latest Message Driven GHOST) 규칙은 어떻게 "정규 체인"을 선택하나요?

1. LMD-GHOST의 기본 원리는 무엇인가요?
2. **왜** "가장 최근 메시지"를 사용하나요? (오래된 메시지를 사용하면 어떤 문제가?)

**답변:**

<!--
1) LMD-GHOST 원리:


2) 최근 메시지 사용 이유:

-->

1. LMD-GHOST 원리:
   포크가 발생했을 때, 각 검증자가 보낸 가장 최근 투표만 집게하여 이를 기반으로 체인을 선택함.

2. 최근 메시지 사용 이유:
   오래된 메시지를 사용하면 네트워크의 상태를 정확하게 반영하지 못할 수 있으며, 이는 잘못된 체인 선택으로 이어질 수 있음. 따라서 가장 최근 메시지를 사용하여 현재 상태를 반영하는 것이 중요함.

---

## 문제 6: RainbowKit Provider 계층 (빈칸 채우기)

다음 코드의 빈칸을 채워서 RainbowKit을 올바르게 설정하세요.
**Provider 순서가 중요합니다!**

```typescript
'use client';

// TODO: 필요한 스타일 import
_________________________________________

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* TODO: Provider를 올바른 순서로 중첩하세요 */}
        <_________________ config={config}>
          <_________________ client={queryClient}>
            <_________________>
              {children}
            </_________________>
          </_________________>
        </_________________>
      </body>
    </html>
  );
}
```

**답변:**

```typescript
// 완성된 코드를 여기에 작성하세요

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* TODO: Provider를 올바른 순서로 중첩하세요 */}
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

```

**왜 이 순서인가요:**

<!--
Provider 순서가 왜 중요한지 설명하세요.
순서가 잘못되면 어떤 오류가 발생하나요?
-->

순서가 잘못되면 지갑 연결 상태를 찾지 못할 수 있고, Wagmi가 React Query 인스턴스를 찾지 못하는 등의 에러가 발생할 수 있음.

---

## 문제 7: Provider 순서 버그 (취약점 찾기)

다음 코드에서 **문제점**을 찾고 수정하세요:

```typescript
// BAD CODE - 문제점 찾기
'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    // 문제가 있는 Provider 순서!
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  );
}
```

**1) 발견한 문제점:**

<!--
무엇이 잘못되었는지 설명하세요.
-->

Provider의 순서상 가장 바깥에 있는 Provider부터 형성되는데, RainbowKitProvider는 WagmiProvider를 참조해야한다. 이 과정에서 Wagmi가 먼저 생성이 되어야 하고 그 다음에 RainbowKitProvider가 만들어져야 하므로 이 둘의 위치가 바뀌어야 한다.

**2) 왜 이것이 문제인가:**

<!--
이 순서로 인해 어떤 오류가 발생하는지 설명하세요.
-->

**3) 올바른 수정 방법:**

```typescript
// GOOD CODE - 수정된 버전을 작성하세요
'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    // 문제가 있는 Provider 순서!
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
  );
}

```

---

## 문제 8: 트랜잭션 상태 처리 (빈칸 채우기)

다음 코드의 빈칸을 채워서 트랜잭션 전송 후 **확인 상태를 추적**하세요:

```typescript
'use client';

import { useWriteContract, _________________ } from 'wagmi';

const abi = [
  {
    name: 'increment',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const;

function IncrementButton() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  // TODO: 트랜잭션 확인 상태를 추적하는 hook
  const { isLoading: isConfirming, isSuccess } = _________________({
    _________________,
  });

  return (
    <div>
      <button
        onClick={() =>
          writeContract({
            address: '0x1234...5678',
            abi,
            functionName: 'increment',
          })
        }
        disabled={isPending || isConfirming}
      >
        {isPending ? '서명 대기 중...' : isConfirming ? '확인 중...' : '증가'}
      </button>

      {isSuccess && <p>트랜잭션 성공!</p>}
    </div>
  );
}
```

**답변:**

```typescript
// 완성된 코드를 여기에 작성하세요
'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const abi = [
  {
    name: 'increment',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const;

function IncrementButton() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  // TODO: 트랜잭션 확인 상태를 추적하는 hook
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <div>
      <button
        onClick={() =>
          writeContract({
            address: '0x1234...5678',
            abi,
            functionName: 'increment',
          })
        }
        disabled={isPending || isConfirming}
      >
        {isPending ? '서명 대기 중...' : isConfirming ? '확인 중...' : '증가'}
      </button>

      {isSuccess && <p>트랜잭션 성공!</p>}
    </div>
  );
}
```

**트랜잭션 상태 흐름을 설명하세요:**

<!--
1) isPending 상태:
2) isConfirming 상태:
3) isSuccess 상태:
-->


isPending : 트랜잭션이 서명 대기 중인 상태
isConfirming : 트랜잭션이 블록에 포함되기를 기다리는 상태
isSuccess : 트랜잭션이 성공적으로 처리된 상태


---

## 문제 9: 검증자 생애주기 (다이어그램 해석)

다음 다이어그램은 이더리움 검증자의 생애주기를 보여줍니다:

```mermaid
stateDiagram-v2
    [*] --> Pending: 32 ETH 입금
    Pending --> Active: 활성화 큐 대기
    Active --> Slashed: 규칙 위반
    Active --> Exiting: 자발적 종료
    Exiting --> Exited: 출금 대기
    Slashed --> Exited: 강제 퇴장
    Exited --> [*]: ETH 출금
```

**질문:**

1. **Active** 상태에서 검증자가 수행하는 주요 활동은 무엇인가요?
블록 제안 : 무작위로 선택된 새 블록 생성 및 제출 
블록 증명 : 다른 검증자가 제안한 블록의 유효성 서명 
동기화 위원회 참여 : 선발된 경우 노드의 체인 동기화 지원 

2. Active에서 **Slashed**로 전이되는 조건은 무엇인가요? 이 경우 검증자에게 어떤 일이 발생하나요?
이중 투표 : 같은 슬롯에서 두 개의 서로 다른 블록에 동시에 서명하는 행위
이중 제안 / 서라운드 투표 : 동일한 슬롯에서 서로 다른 블록을 제안하거나, 이전에 제출한 attestation과 충돌하거나 이를 둘러싸는 형태로 다시 투표하는 행위를 하게 된다면 Slashed로 전이되며, 이 경우 검증자가 바로 퇴출되는 패널티를 부여받고 대기 기간동안 몰수 패널티가 적용된 뒤 잔여 ETH만 출금된다. 

3. 검증자가 자발적으로 종료(**Exiting**)하려면 왜 바로 ETH를 출금할 수 없고 대기 기간이 필요한가요?
대기 기간 동안 검증자는 블록 제안 및 증명에 참여할 수 있으며, 이 기간이 끝난 후에야 ETH 출금이 가능하다. 이는 검증자가 네트워크에 미치는 영향을 최소화하고, 잠재적인 악용을 방지하기 위한 조치이다.

---

## 문제 10: Provider 계층 구조 (다이어그램 해석)

다음 다이어그램은 RainbowKit/wagmi 앱의 Provider 구조를 보여줍니다:

```mermaid
graph TD
    subgraph App["React App"]
        WP["WagmiProvider<br/>config 제공"]
        QP["QueryClientProvider<br/>캐싱/상태관리"]
        RP["RainbowKitProvider<br/>지갑 UI"]
        COMP["Components<br/>useAccount, useWriteContract 등"]
    end

    WP --> QP --> RP --> COMP

    subgraph Deps["의존성"]
        CONFIG["wagmi config"]
        QC["QueryClient"]
        WALLET["지갑 연결 상태"]
    end

    CONFIG -.-> WP
    QC -.-> QP
    WP -.-> RP
    QP -.-> COMP
```

**질문:**

1. **WagmiProvider**가 가장 바깥에 있어야 하는 이유는 무엇인가요?
WagmiProvider는 지갑 연결 상태, 체인 정보, 컨트랙트 설정 등 앱 전반에서 필요한 핵심 컨텍스트를 제공한다. 따라서 가장 바깥에 위치하여 제일 먼저 생성되어야 그 이후에 연결되는 다른 정보들에 손쉽게 접근할 수 있도록 도와준다. 

2. **QueryClientProvider**의 역할은 무엇인가요? 없다면 어떤 문제가 발생하나요?
QueryClientProvider는 React Query의 클라이언트를 제공하여 데이터 패칭, 캐싱 및 상태 관리를 가능하게 한다. 만약 이 Provider가 없다면, React Query의 기능을 사용할 수 없게 되어 데이터 패칭 및 상태 관리가 어려워진다.

3. 아래 코드에서 `useAccount()` hook이 **"Cannot find WagmiContext"** 오류를 발생시키는 이유는 무엇인가요?

```typescript
// 오류 발생 코드
<QueryClientProvider>
  <RainbowKitProvider>
    <WagmiProvider>  {/* WagmiProvider가 안쪽에 있음 */}
      <MyComponent />  {/* useAccount() 호출 */}
    </WagmiProvider>
  </RainbowKitProvider>
</QueryClientProvider>
```

지갑이 연결되지 않은 상태에서 RainbowKitProvider가 활성화되면 WagmiProvider에 접근할 수 없게 되어 useAccount() hook이 WagmiContext를 찾지 못하게 된다. 이로 인해 "Cannot find WagmiContext" 오류가 발생한다.

---

## 제출 전 체크리스트

- [x] 모든 문제에 답변을 작성했는가?
- [x] 객관식 문제: 정답 선택 **이유**를 설명했는가?
- [x] 단답형 문제: 2-3문장 이상으로 충분히 설명했는가?
- [x] 코드 문제: 완성된 코드와 **왜 그렇게 작성했는지** 설명했는가?
- [x] 다이어그램 문제: 각 질문에 논리적으로 답변했는가?
