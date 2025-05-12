import { type Address } from 'viem'
import { formatUnits, parseUnits } from 'viem'

// Contract ABI
export const SAVINGS_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "_usdcAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "ExceedsTarget", type: "error" },
  { inputs: [], name: "ExpectedPause", type: "error" },
  { inputs: [], name: "InactivePlan", type: "error" },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "InvalidAmount", type: "error" },
  { inputs: [], name: "InvalidPlanId", type: "error" },
  { inputs: [], name: "InvalidPlanType", type: "error" },
  { inputs: [], name: "LockPeriodNotEnded", type: "error" },
  { inputs: [], name: "LockPeriodRequired", type: "error" },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "OwnableInvalidOwner", type: "error" },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "PlanAlreadyDeactivated", type: "error" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [], name: "TargetRequired", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  { inputs: [], name: "UnauthorizedAccess", type: "error" },
  { inputs: [], name: "ZeroAddress", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "planId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newBalance", type: "uint256" },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "planId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "EmergencyWithdrawal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "enum FlexibleSavings.SavingsType", name: "planType", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "newAmount", type: "uint256" },
    ],
    name: "MinimumDepositUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "planId", type: "uint256" },
      { indexed: false, internalType: "enum FlexibleSavings.SavingsType", name: "savingsType", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "PlanCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "planId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "PlanDeactivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "planId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "remainingBalance", type: "uint256" },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      { internalType: "enum FlexibleSavings.SavingsType", name: "_type", type: "uint8" },
      { internalType: "uint256", name: "_target", type: "uint256" },
      { internalType: "uint256", name: "_lockPeriod", type: "uint256" },
    ],
    name: "createSavingsPlan",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_planId", type: "uint256" }],
    name: "deactivatePlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_planId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_planId", type: "uint256" }],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_planId", type: "uint256" }],
    name: "getPlanDetails",
    outputs: [
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "target", type: "uint256" },
      { internalType: "uint256", name: "lockPeriodEnd", type: "uint256" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "enum FlexibleSavings.SavingsType", name: "savingsType", type: "uint8" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserPlansCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "enum FlexibleSavings.SavingsType", name: "", type: "uint8" }],
    name: "minimumDeposits",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "pause", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "enum FlexibleSavings.SavingsType", name: "_type", type: "uint8" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "setMinimumDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "unpause", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userSavingsPlans",
    outputs: [
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "target", type: "uint256" },
      { internalType: "uint256", name: "lockPeriodEnd", type: "uint256" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "enum FlexibleSavings.SavingsType", name: "savingsType", type: "uint8" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_planId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "savingsType", type: "uint8" },
      { name: "target", type: "uint256" },
      { name: "lockPeriod", type: "uint256" },
    ],
    name: "createPlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getFlexibleBalance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Contract address - replace with your deployed contract address
export const SAVINGS_CONTRACT_ADDRESS = '0x29aC1C1A9cfeCB4b09369Bf1107d45237e0Ae7E1' as Address

// USDC contract address - replace with the actual USDC address on your network
export const USDC_CONTRACT_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address

// USDC ABI (simplified for approve and transfer)
export const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
]

// Savings plan types enum
export enum SavingsType {
  FLEXIBLE = 0,
  GOAL_BASED = 1,
  TIME_BASED = 2,
}

// Plan details interface
export interface PlanDetails {
  savingsType: SavingsType
  balance: bigint
  target: bigint
  lockPeriod: bigint
  active: boolean
}

// Format USDC amount for display
export function formatUSDC(amount: bigint | null): string {
  if (!amount) return "0.00"
  return formatUnits(amount, 6)
}

// Parse USDC amount from user input
export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, 6)
}

// Get savings type name
export function getSavingsTypeName(type: SavingsType): string {
  switch (type) {
    case SavingsType.FLEXIBLE:
      return "Flexible"
    case SavingsType.GOAL_BASED:
      return "Goal-based"
    case SavingsType.TIME_BASED:
      return "Time-based"
    default:
      return "Unknown"
  }
}

// Format timestamp to date string
export function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString()
}

// Calculate progress percentage
export function calculateProgress(balance: bigint, target: bigint): number {
  if (!target || target === 0n) return 0
  return Number((balance * 100n) / target)
}

// Calculate days remaining
export function daysRemaining(lockPeriodEnd: bigint): number {
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (lockPeriodEnd <= now) return 0
  return Number((lockPeriodEnd - now) / 86400n)
}
