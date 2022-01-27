import WalletBalance from './WalletBalance';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ZeniNFT from '../utils/contractABI.json';
import placeholder from '../img/placeholder.png'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from './Loading';
import './Home.css';
const contractAddress = '0x5B0B06F61E6401C0Af94bb8D5a8545074bc569CC';
const provider = new ethers.providers.Web3Provider(window.ethereum);

//end user 
const signer = provider.getSigner();

//get smart contract 
const contract = new ethers.Contract(contractAddress, ZeniNFT.abi, signer);

export default function Home() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingWallet, setLoadingWallet] = useState(false);
  // Render Methods
    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
        * User can have multiple authorized accounts, we grab the first one if its there!
        */
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account)
        } else {
            console.log("No authorized account found")
        }

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4"; 
        if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
        }
    }

    const connectWallet = async () => {
        try {
        const { ethereum } = window;
    
        if (!ethereum) {
            alert("Get MetaMask!");
            return;
        }
    
        //method to request access to account 
        setLoadingWallet(true);
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        setLoadingWallet(false);
        console.log('Connected', accounts[0]);
        setCurrentAccount(accounts[0]);
        window.location.reload()
        } catch (error) {
        console.log(error)
        }
    }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
      getCount();
    }, []);
  
    const getCount = async () => {
      const count = await contract.count();
      console.log(parseInt(count));
      setTotalMinted(parseInt(count));
    };

    function NFTImage({ tokenId, getCount }) {
        const contentId = 'QmQu1KL9N1htzSTZY3W42FR4NtopTby5xdQ8KoAX8U3GXE';
        const metadataURI = `${contentId}/${tokenId}.json`;
        const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
      
        const [isMinted, setIsMinted] = useState(false);
        useEffect(() => {
          getMintedStatus();
        }, [isMinted]);
      
        const getMintedStatus = async () => {
          const result = await contract.isContentOwned(metadataURI);
          console.log(result)
          setIsMinted(result);
        };
      
        const mintToken = async () => {
          const connection = contract.connect(signer);
          const addr = connection.address;
          const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.01'),
          });
          setLoading(true);
          await result.wait();
          getMintedStatus();
          getCount();
          setLoading(false);
        };
      
        async function getURI() {
          const uri = await contract.tokenURI(tokenId);
          alert(uri);
        }
        return (
            <Card style={{width:'18rem'}}>
                <Card.Img variant='top' src={isMinted ? imageURI : placeholder} />
                <Card.Body>
                    <Card.Title>ID #{tokenId}</Card.Title>
                    {loading ? <Button>Minting in Process...</Button> : (!isMinted ? (
                        <Button onClick={mintToken} variant='primary'>
                            Mint
                        </Button>
                    ) : (
                        <Button onClick={getURI} variant='primary'>
                            Taken! Show URI
                        </Button>
                    ))}
                </Card.Body>
            </Card>
        );
      }

  return (
  <div className='home'>
      {loadingWallet ? <Loading /> : currentAccount === '' ? (
          <Container >
            <Row className='gy-5 '>
                <Button variant='primary' size='lg' onClick={connectWallet}>Connect to Wallet</Button>
                {Array(5)
                    .fill(0)
                    .map((_,i) => (
                        <Col className='d-flex justify-content-center'>
                            <Card style={{width:'18rem'}}>
                                <Card.Img variant='top' src={placeholder} />
                                <Card.Body>
                                    <Card.Title>ID #?</Card.Title>
                                    <p>Connect Wallet!</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
          </Container>
      ) : (
    <Container >
        <Row className='gy-5'>
            <WalletBalance />
                {Array(totalMinted)
                .fill(0)
                .map((_, i) => (
                    <Col key={i + 1} className='d-flex justify-content-center' >
                        <NFTImage tokenId={i + 1} getCount={getCount} />
                    </Col>
                ))}
        </Row>
    </Container>
      )}
  </div>
  )
}