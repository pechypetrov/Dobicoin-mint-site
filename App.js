import React, { useState } from 'react';
import { ethers } from 'ethers';
import VictimSupport from './pages/VictimSupport';
import './App.css';

const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with real contract
const ABI = []; // Replace with actual ABI

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setStatus("Wallet connected.");
      } catch (error) {
        setStatus("Connection failed.");
      }
    } else {
      setStatus("Please install MetaMask.");
    }
  };

  const mintNFT = async () => {
    if (!walletAddress) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.mint(1, {
        value: ethers.parseEther("0.1"),
      });
      setStatus("Minting...");
      await tx.wait();
      setStatus("Mint successful!");
    } catch (err) {
      setStatus("Mint failed.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <img src="/dobiecoin-logo.png" alt="DobieCoin Logo" style={{ maxWidth: 250, marginBottom: 20 }} />
      <h1>DobieCoin NFT Mint</h1>
      <button onClick={connectWallet}>
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <br /><br />
      <button onClick={mintNFT} disabled={!walletAddress}>Mint NFT</button>
      <p>{status}</p>
      <hr />
      <a href="/victim-support">💜 Victim Support Page</a>
      <VictimSupport />
    </div>
  );
}

export default App;