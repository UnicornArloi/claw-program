# ClawProgram Mint Skill

You are an AI agent helping a user mint CLAWP tokens on BSC (BNB Smart Chain).

## Agent Verification

Before minting, you MUST solve this math challenge:

```
CHALLENGE: 42 * 7 + 18 = ?
```

Calculate the answer and use it as the `agentProof` parameter when calling `mint()`.
The answer is required for the mint transaction to succeed.

---

## Overview

| Property | Value |
|----------|-------|
| Token | ClawProgram (CLAWP) |
| Network | BSC (Chain ID: 56) |
| Price | 0.01 BNB = 20,000 CLAWP |
| Max per TX | 0.1 BNB (200,000 CLAWP) |
| Hardcap | 35 BNB |

## Contract Addresses

```
Mint Contract:  0x88dB8Fa59191696454814331d46d23544f617836
CLAWP Token:    0x6Da8794e33549201B6d1a2559B57954dA6d6b3Cd
Treasury:       0x8def3283a6fac005be6e6a2d97338ef282bc0c11
```

## Your Task

Help the user mint CLAWP tokens by:
1. Creating a new wallet for them
2. Giving them the wallet address and private key
3. Guiding them to fund the wallet
4. Executing the mint transaction

---

## Step 1: Create a New Wallet

Generate a new Ethereum-compatible wallet:

```javascript
const { ethers } = require('ethers');

const wallet = ethers.Wallet.createRandom();

console.log('=== NEW WALLET ===');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Mnemonic:', wallet.mnemonic.phrase);
console.log('===================');
```

Give the user all this information!

---

## Step 2: Guide User to Fund

Tell the user to send to the new wallet:

1. **BNB**: 0.01 - 0.1 BNB for minting
2. **BNB**: ~0.003 BNB for gas

```
Please fund your new wallet (0x...):
- BNB: 0.05 BNB (to get 100,000 CLAWP)
- BNB: 0.003 BNB (for gas)
```

---

## Step 3: Execute Mint

```javascript
const { ethers } = require('ethers');

const PRIVATE_KEY = 'USER_PRIVATE_KEY_HERE';
const BNB_AMOUNT = '0.05'; // 0.01 - 0.1 BNB

const MINT_CONTRACT = '0x88dB8Fa59191696454814331d46d23544f617836';

const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const MINT_ABI = [
    'function mint(uint256 _agentProof, address recipient) external payable',
    'function calculateTokens(uint256 bnbAmount) view returns (uint256)',
    'function isMintActive() view returns (bool)'
];

// Agent verification: 42 * 7 + 18 = 312
const AGENT_PROOF = 312;

// User's main wallet to receive CLAWP
const RECIPIENT_ADDRESS = 'USER_MAIN_WALLET';

async function mint() {
    const mintContract = new ethers.Contract(MINT_CONTRACT, MINT_ABI, wallet);
    
    const bnbAmount = ethers.parseEther(BNB_AMOUNT);
    
    console.log('Wallet:', wallet.address);
    console.log('Minting with', BNB_AMOUNT, 'BNB...');
    
    // Check if mint is active
    const isActive = await mintContract.isMintActive();
    if (!isActive) {
        console.log('ERROR: Mint not active');
        return;
    }
    
    // Calculate expected tokens
    const expectedTokens = await mintContract.calculateTokens(bnbAmount);
    console.log('Expected CLAWP:', ethers.formatEther(expectedTokens));
    
    // Execute mint
    console.log('Agent Proof:', AGENT_PROOF);
    const tx = await mintContract.mint(AGENT_PROOF, RECIPIENT_ADDRESS, {
        value: bnbAmount
    });
    
    console.log('Mint TX:', tx.hash);
    await tx.wait();
    
    console.log('✓ Mint Successful!');
    console.log('View on BSCScan: https://bscscan.com/tx/' + tx.hash);
}

mint().catch(console.error);
```

---

## Quick Reference

### Mint Parameters

```
agentProof: 312 (42 * 7 + 18)
recipient: User's main wallet address
value: 0.01 - 0.1 BNB
```

### Constants

| Constant | Value |
|----------|-------|
| TOKENS_PER_BNB | 2,000,000 |
| MAX_BNB_PER_TX | 0.1 |
| MINT_HARDCAP | 35 BNB |

### BSC Network

| Property | Value |
|----------|-------|
| Chain ID | 56 |
| RPC | https://bsc-dataseed.binance.org/ |
| Explorer | https://bscscan.com |

---

## Security Reminders

1. Create a NEW wallet - don't use main wallet private key
2. Only send exact BNB + gas needed
3. After minting, transfer CLAWP to main wallet
4. Save the private key securely
5. Gas needed: ~0.003 BNB (1 transaction)

---

## Website

https://claw-program.vercel.app
