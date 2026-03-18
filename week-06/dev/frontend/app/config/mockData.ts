const DAY = 86400n;
const NOW = BigInt(Math.floor(Date.now() / 1000));

export type Campaign = {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  subject: string;
  goal: bigint;
  raised: bigint;
  deadline: bigint;
  withdrawn: boolean;
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1n,
    creator: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    title: "AP Chemistry tutoring sessions",
    description: "Need weekly tutoring sessions for AP Chemistry — struggling with equilibrium and thermodynamics.",
    subject: "Chemistry",
    goal: 200000000000000000n,   // 0.2 ETH
    raised: 144000000000000000n, // 0.144 ETH
    deadline: NOW + DAY * 9n,
    withdrawn: false,
  },
  {
    id: 2n,
    creator: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    title: "Geometry workbook & graph paper",
    description: "Need supplies for my final project on 3D shapes — currently using scrap paper.",
    subject: "Math",
    goal: 50000000000000000n,    // 0.05 ETH
    raised: 24000000000000000n,  // 0.024 ETH
    deadline: NOW + DAY * 12n,
    withdrawn: false,
  },
  {
    id: 3n,
    creator: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6",
    title: "Online lab simulation access",
    description: "Subscription to virtual dissection software for biology coursework at home.",
    subject: "Biology",
    goal: 100000000000000000n,   // 0.1 ETH
    raised: 89000000000000000n,  // 0.089 ETH
    deadline: NOW + DAY * 3n,
    withdrawn: false,
  },
  {
    id: 4n,
    creator: "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
    title: "Essay editing & feedback sessions",
    description: "University application essays — need a writing coach for 4 sessions before deadline.",
    subject: "Writing",
    goal: 200000000000000000n,   // 0.2 ETH
    raised: 62000000000000000n,  // 0.062 ETH
    deadline: NOW + DAY * 21n,
    withdrawn: false,
  },
];
