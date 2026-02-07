// ClawProgram Mint Test Script
// Run with: node test-mint.js

const { ethers } = require('ethers');

// === CONFIGURATION ===
const PRIVATE_KEY = 'YOUR_PRIVATE_KEY_HERE'; // Replace with a funded wallet
const BNB_AMOUNT = '0.01'; // 0.01 - 0.1 BNB
const RECIPIENT_ADDRESS = '0x8def3283a6fac005be6e6a2d97338ef282bc0c11'; // Your main wallet

// Contract addresses
const MINT_CONTRACT = '0x4c0F7F920588d53B33276191362Ed28CCa976763';
const CLAWP_ADDRESS = '0x6Da8794e33549201B6d1a2559B57954dA6d6b3Cd';

// BSC RPC
const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Minter ABI
const MINT_ABI = [
    'function mint(uint256 _agentProof, address recipient) external payable',
    'function calculateTokens(uint256 bnbAmount) view returns (uint256)',
    'function isMintActive() view returns (bool)',
    'function totalBNBCollected() view returns (uint256)',
    'function MINT_HARDCAP() view returns (uint256)',
    'function clawProgram() view returns (address)'
];

async function testMint() {
    console.log('=== CLAWP MINT TEST ===\n');
    
    try {
        const mintContract = new ethers.Contract(MINT_CONTRACT, MINT_ABI, wallet);
        
        console.log('Wallet:', wallet.address);
        console.log('Recipient:', RECIPIENT_ADDRESS);
        console.log('BNB Amount:', BNB_AMOUNT);
        console.log('');
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log('Wallet BNB Balance:', ethers.formatEther(balance));
        
        if (Number(balance) < Number(ethers.parseEther(BNB_AMOUNT))) {
            console.log('ERROR: Insufficient BNB balance');
            return;
        }
        
        // Check if mint is active
        const isActive = await mintContract.isMintActive();
        console.log('Mint Active:', isActive);
        
        if (!isActive) {
            console.log('ERROR: Mint is not active');
            return;
        }
        
        // Calculate expected tokens
        const bnbAmount = ethers.parseEther(BNB_AMOUNT);
        const expectedTokens = await mintContract.calculateTokens(bnbAmount);
        console.log('Expected CLAWP:', ethers.formatEther(expectedTokens));
        console.log('');
        
        // Agent proof: 42 * 7 + 18 = 312
        const AGENT_PROOF = 312;
        console.log('Agent Proof:', AGENT_PROOF);
        console.log('');
        
        // Execute mint
        console.log('Executing mint...');
        const tx = await mintContract.mint(AGENT_PROOF, RECIPIENT_ADDRESS, {
            value: bnbAmount
        });
        
        console.log('Transaction Hash:', tx.hash);
        console.log('\nWaiting for confirmation...');
        
        await tx.wait();
        
        console.log('\n✓ MINT SUCCESSFUL!');
        console.log('View on BSCScan: https://bscscan.com/tx/' + tx.hash);
        
        // Check CLAWP balance
        const ERC20_ABI = ['function balanceOf(address owner) view returns (uint256)'];
        const clawToken = new ethers.Contract(CLAWP_ADDRESS, ERC20_ABI, provider);
        const clawBalance = await clawToken.balanceOf(RECIPIENT_ADDRESS);
        console.log('\nRecipient CLAWP Balance:', ethers.formatEther(clawBalance));
        
    } catch (error) {
        console.log('\n✗ MINT FAILED');
        console.log('Error:', error.message || error);
    }
}

testMint();
