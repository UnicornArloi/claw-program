// ClawProgram Approve Script
// Run with: node approve-mint.js

const { ethers } = require('ethers');

// === CONFIGURATION ===
const TREASURY_PRIVATE_KEY = 'YOUR_TREASURY_PRIVATE_KEY';
const MINT_CONTRACT = '0x4c0F7F920588d53B33276191362Ed28CCa976763';
const CLAWP_ADDRESS = '0x6Da8794e33549201B6d1a2559B57954dA6d6b3Cd';

const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const treasury = new ethers.Wallet(TREASURY_PRIVATE_KEY, provider);

// ERC20 ABI
const ERC20_ABI = [
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)'
];

async function approve() {
    console.log('=== APPROVE MINT CONTRACT ===\n');
    
    try {
        const token = new ethers.Contract(CLAWP_ADDRESS, ERC20_ABI, treasury);
        
        // Check current allowance
        const currentAllowance = await token.allowance(treasury.address, MINT_CONTRACT);
        console.log('Current Allowance:', ethers.formatEther(currentAllowance));
        
        if (Number(currentAllowance) > 0) {
            console.log('Already approved!');
            return;
        }
        
        // Approve 70M CLAWP
        const approveAmount = ethers.parseEther('70000000');
        console.log('\nApproving', ethers.formatEther(approveAmount), 'CLAWP...');
        
        const tx = await token.approve(MINT_CONTRACT, approveAmount);
        console.log('TX:', tx.hash);
        
        await tx.wait();
        
        console.log('\n✓ APPROVED!');
        console.log('Mint contract can now transfer CLAWP.');
        
    } catch (error) {
        console.log('\n✗ FAILED');
        console.log('Error:', error.message || error);
    }
}

approve();
