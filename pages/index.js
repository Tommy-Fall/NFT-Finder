import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
import { OpenSeaPort, Network } from 'opensea-js'
import axios from 'axios'

let seaport;

export default function Home() {

  const [token, setToken] = useState({
    id: '',
    address: '',
    offrAddress: '',
    startAmount: '',

    wallet: ''
  })

  const handleInputChange = event => {
    const { name, value } = event.target
    setToken({ ...token, [name]: value })
  }

  useEffect(() => {

    async function Main() {
      const provider = await detectEthereumProvider();

      let account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(account[0])

      seaport = new OpenSeaPort(provider, {
        networkName: Network.Main,
        //   apiKey: YOUR_API_KEY
      })

      const tokenn = (await seaport.api.getPaymentTokens({ symbol: 'USDC' })).tokens[0]
      console.log(tokenn)
    }
    Main()
  }, [])




  const getAsset = async () => {

    const asset = await seaport.api.getAsset({
      tokenAddress: token.address,
      tokenId: token.id,
    })
    console.log(asset)
  }

  const makeOffer = async () => {
    const offer = await seaport.createBuyOrder({

      asset: {
        tokenAddress: token.address,
        tokenId: token.id,
      },
      accountAddress: token.offrAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: token.startAmount,
      // paymentTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    })
    console.log(offer)
  }

  // const handleEthereum = () => {
  //   const {
  //     ethereum
  //   } = window;
  //   if (ethereum && ethereum.isMetaMask) {
  //     alert('Ethereum successfully detected!');
  //     // Access the decentralized web!

  //   } else {
  //     alert('Please install MetaMask!');
  //   }
  // }

  return (
    <div className={styles.container}>
      <form>
        <label>Token ID</label>
        <input
          value={token.id}
          onChange={handleInputChange}
          name='id'
        />
        <br />
        <label>Token Address</label>
        <input
          value={token.address}
          onChange={handleInputChange}
          name='address'
        />
        <br />
        <label>Offerer's wallet address</label>
        <input
          value={token.offrAddress}
          onChange={handleInputChange}
          name='offrAddress'
        />
        <br />
        <label>Start Amount</label>
        <input
          value={token.startAmount}
          onChange={handleInputChange}
          name='startAmount'
        />
        <br />
      </form>
      <button onClick={getAsset}>Get Asset</button>
      <button onClick={makeOffer}>Make Offer</button>
     
      
    </div>
  )
}