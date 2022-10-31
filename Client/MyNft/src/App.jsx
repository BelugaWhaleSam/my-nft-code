import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress, myAddress } from "./utils/constants";
import "./App.css";

function App() {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  const [code, setCode] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const data = {
    'aws': 50,
    "cat": 2,
    "dog": 3,
    'car': 4,
  };

  const getEthereumContract = () => {
    //Web3 provider allows your application to communicate with an Ethereum or Blockchain Node.
    const provider = new ethers.providers.Web3Provider(ethereum);
    // A Signer is a class which (usually) in some way directly or indirectly has access to a private key, which
    // can sign messages and transactions to authorize the network to charge your account ether to perform operations.
    const signer = provider.getSigner();
    // To fetch our contract and deploy contract and use smart contracts functions
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    return transactionContract;
  };

  // Is called when the user clicks the button
  const Mint = async () => {
    try {
      const transactionContract = getEthereumContract();

      Object.keys(data).forEach(function (key) {
        if (key === code) {
          transactionContract.safeMint(myAddress, data[key]);
        }
      });
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum wallet found");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please connect to Metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      // If on initial mounting, the account is already conencted
      // we can set the cuurentAccount to the connected account
      // This can be further used to fetch the transactions and send as props in context
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account connected");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum wallet found");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please connect to Metamask");
      // eth_requestAccounts is a method that will request the user to connect to their metamask wallet
      // Also It will return the list of accounts associated with the wallet

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const ChainId = "0x5";

      if (chainId !== ChainId) {
        alert("You are not connected to the Goerli Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // We'll set the first account in the array as the connected account
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum wallet found");
    }
  };

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    const ChainId = "0x5";

    if (chainId !== ChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
  }, []);

  function setTheValueOfCode() {
    setCode(code);
    Mint();
  }

  return (
    <div className="App">
      {!currentAccount && (
        <button className="button" type="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {currentAccount && (
        <div className="button-mint">
          <h2>Enter the valid code !</h2>
          <input
            type="text"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
            }}
          />
          <button onClick={setTheValueOfCode}>Mint</button>
        </div>
      )}
    </div>
  );
}

export default App;
