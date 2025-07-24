import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xYourContractAddress"; // replace this
const ABI = [
  // your smart contract ABI here
];

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
        setStatus("Wallet connected");
      } catch (err) {
        setStatus("Failed to connect wallet");
      }
    } else {
      setStatus("MetaMask not found");
    }
  };

  const mint = async () => {
    if (!wallet) {
      setStatus("Connect wallet first");
      return;
    }

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
      console.error(err);
      setStatus("Mint failed");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>DobieCoin NFT Mint</h1>
      <p>Mint Price: 0.1 BNB</p>
      <button onClick={connectWallet}>
        {wallet ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <br /><br />
      <button onClick={mint} disabled={!wallet}>Mint NFT</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
