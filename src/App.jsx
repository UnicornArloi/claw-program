import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Contract addresses
const CLAWP_ADDRESS = '0x6Da8794e33549201B6d1a2559B57954dA6d6b3Cd';
const MINT_ADDRESS = '0x88dB8Fa59191696454814331d46d23544f617836';
const AGENT_PROOF = 312;

// Minimal ERC20 ABI
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
];

// Minter ABI
const MINTER_ABI = [
  'function clawProgram() view returns (address)',
  'function treasury() view returns (address)',
  'function mintEnabled() view returns (bool)',
  'function totalBNBCollected() view returns (uint256)',
  'function MINT_HARDCAP() view returns (uint256)',
];

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [clawBalance, setClawBalance] = useState('0');
  const [bnbBalance, setBnbBalance] = useState('0');
  const [mintProgress, setMintProgress] = useState('0');
  const [mintEnabled, setMintEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  useEffect(() => {
    if (account && provider) {
      fetchBalances();
      fetchProgress();
    }
  }, [account, provider]);

  const connectWallet = async () => {
    if (!provider) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    } catch (err) {
      alert('Connection failed!');
    }
  };

  const fetchBalances = async () => {
    if (!account) return;
    try {
      const clawToken = new ethers.Contract(CLAWP_ADDRESS, ERC20_ABI, provider);
      const clawBal = await clawToken.balanceOf(account);
      const bnbBal = await provider.getBalance(account);

      setClawBalance(ethers.formatUnits(clawBal, 18));
      setBnbBalance(ethers.formatUnits(bnbBal, 18));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchProgress = async () => {
    try {
      const minter = new ethers.Contract(MINT_ADDRESS, MINTER_ABI, provider);
      const collected = await minter.totalBNBCollected();
      const hardcap = await minter.MINT_HARDCAP();
      const enabled = await minter.mintEnabled();

      const progress = (Number(collected) / Number(hardcap) * 100).toFixed(2);
      setMintProgress(progress);
      setMintEnabled(enabled);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(`curl -s ${window.location.origin}/skill.md`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">$CLAWP_</div>
        <div className="badge">BNB_CHAIN</div>
      </header>

      <main className="main">
        <section className="hero">
          <h1>
            <span className="neuro">$CLAWP</span>
            <span>AI_AGENT</span>
            <span>TOKEN</span>
          </h1>
          <p>AI Agent Token Program. Minted by machines.</p>
          
          {!account ? (
            <button className="hero-btn" onClick={connectWallet}>
              [ CHECK_BALANCE ]
            </button>
          ) : (
            <div className="wallet-info">
              <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
            </div>
          )}
        </section>

        {account && (
          <section className="balances">
            <div className="balance-card">
              <div className="balance-label">YOUR_CLAWP</div>
              <div className="balance-value">{Number(clawBalance).toLocaleString()}</div>
            </div>
            <div className="balance-card">
              <div className="balance-label">YOUR_BNB</div>
              <div className="balance-value">{Number(bnbBalance).toFixed(4)}</div>
            </div>
          </section>
        )}

        <section className="progress-section">
          <div className="progress-header">
            <span>MINT_PROGRESS</span>
            <span className={mintEnabled ? 'green' : 'red'}>{mintEnabled ? 'ACTIVE' : 'ENDED'} {mintProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: mintProgress + '%' }}></div>
          </div>
        </section>

        <section className="cmd-section">
          <h2 className="section-title">> SEND_TO_AGENT</h2>
          <div className="cmd-box" onClick={copyCommand}>
            <div className="cmd-text">
              curl -s {window.location.origin}/skill.md
            </div>
            <div className="cmd-hint">
              [{copied ? 'COPIED!' : 'CLICK_TO_COPY'}]
            </div>
          </div>
          <p className="cmd-desc">
            Send this command to your AI agent. It will read skill.md,<br/>
            create a wallet, fund it, and execute the mint.
          </p>
        </section>

        <section className="steps-section">
          <h2 className="section-title">> HOW_IT_WORKS</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3>SEND_CMD</h3>
              <p>Send curl command to your AI agent</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3>AGENT_READS</h3>
              <p>Agent reads skill.md and understands process</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3>AGENT_MINTS</h3>
              <p>Agent creates wallet and mints for you!</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-title">> CONTRACT_INFO</h2>
          <div className="contracts-grid">
            <div className="contract-item">
              <div className="contract-label">CLAWP_TOKEN</div>
              <div className="contract-value">
                <a href={`https://bscscan.com/address/${CLAWP_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                  {CLAWP_ADDRESS.slice(0, 8)}...{CLAWP_ADDRESS.slice(-6)}
                </a>
              </div>
            </div>
            <div className="contract-item">
              <div className="contract-label">MINT_CONTRACT</div>
              <div className="contract-value">
                <a href={`https://bscscan.com/address/${MINT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                  {MINT_ADDRESS.slice(0, 8)}...{MINT_ADDRESS.slice(-6)}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <h2 className="section-title">> FAQ</h2>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-q">[00] WHAT_IS_CLAWP?</div>
              <div className="faq-a">BEP-20 Agent-Native token. AI agents can discover and mint autonomously.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">[01] MINIMUM_MINT?</div>
              <div className="faq-a">0.01 BNB minimum, 0.1 BNB maximum per transaction.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">[02] AGENT_PROOF?</div>
              <div className="faq-a">312 (42 x 7 + 18). Agent must solve this to mint.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>BAP-578 /// BEP-20 /// BNB_CHAIN /// 2026</span>
      </footer>
    </div>
  );
}

export default App;
