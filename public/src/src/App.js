import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with your actual NFT contract
const ABI = [
  // Replace with actual ABI
];

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
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
    if (!window.ethereum) {
      setStatus("Please install MetaMask.");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.mint(1, {
        value: ethers.parseEther("0.1"), // Mint price in BNB
      });
      setStatus("Minting...");
      await tx.wait();
      setStatus("Mint successful!");
    } catch (err) {
      console.error(err);
      setStatus("Mint failed.");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <h1>DobieCoin NFT Mint</h1>
      <p>Mint Price: 0.1 BNB | Max 3 per wallet</p>
      <button onClick={connectWallet}>
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <br /><br />
      <button onClick={mintNFT} disabled={!walletAddress}>
        Mint NFT
      </button>
      <p>{status}</p>
    </div>
  );
}

export default App;
