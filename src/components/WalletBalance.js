import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
function WalletBalance() {

    const [balance, setBalance] = useState();
    
    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };
  
    return (
      <div>
          <h5>Your Balance: {balance}</h5>
          <Button variant='primary' onClick={() => getBalance()}>Show My Balance</Button>
      </div>
    );
  };
  
  export default WalletBalance;