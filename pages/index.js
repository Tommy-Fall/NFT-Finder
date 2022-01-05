import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
import { OpenSeaPort, Network } from 'opensea-js'
import axios from 'axios'

let seaport;
// let provider;

export default function Home() {

  const [token, setToken] = useState({
    id: '',
    address: '',
    offrAddress: '',
    startAmount: '',

    wallet: ''
  })

  const [assets, setAssets] = useState([])

  const handleInputChange = event => {
    const { name, value } = event.target
    setToken({ ...token, [name]: value })
  }

  useEffect(() => {

    // axios.get('https://api.opensea.io/api/v1/collection/somnium-space/stats').then(res=>{
    //   console.log(res.data)
    // })

    // axios.get('https://api.opensea.io/api/v1/assets?order_by=sale_count&order_direction=desc&offset=0&limit=1000&collection=somnium-space').then(res => {
    //   console.log(res.data.assets)
    //   setAssets(res.data.assets)
    // })


    async function test() {
      const provider = await detectEthereumProvider();

      let account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(account[0])
      seaport = new OpenSeaPort(provider, {
        networkName: Network.Main,
        //   apiKey: YOUR_API_KEY
      })
    }
    test()


    // const signature = await ethereum.request({ method: 'personal_sign', params: [ 'Hello hello', account[0] ] });
    // console.log(signature)
    // const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/a0008d9d48c74632be8df0ff171d2af5')

    // seaport = new OpenSeaPort(provider, {
    //   networkName: Network.Main,
    //   //   apiKey: YOUR_API_KEY
    // })
    // const tokenn = (await seaport.api.getPaymentTokens({ symbol: 'USDC' })).tokens[0]
    // console.log(tokenn)



    // const offer = await seaport.createBuyOrder({

    //   asset: {
    //     tokenAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    //     tokenId: '36485824513700346925635491140101516969102708701637270493589643126838709452801',
    //   },
    //   accountAddress: '0x8b73704918df1e5bcfd4d0ea2a04a7b534a06f80',
    //   // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
    //   startAmount: 0.000002,
    //   paymentTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    // })
    // console.log(offer)











  }, [])




  const getAsset = async (event) => {

    const asset = await seaport.api.getAsset({
      tokenAddress: token.address,
      tokenId: token.id,
    })
    console.log(asset)
  }

  const makeOfferr = async (address = token.address, id = token.id, offrAddress = token.offrAddress, startAmount = token.startAmount) => {
    console.log(address,id,offrAddress,startAmount)
    const offer = await seaport.createBuyOrder({

      asset: {
        tokenAddress: address,
        tokenId: id,
      },
      accountAddress: offrAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: startAmount,
      // paymentTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    })
    console.log(offer)
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

  const runBot = () => {
    setAssets([])
    for (let i = 1; i < 3; i++) {
      axios.get(`https://api.opensea.io/api/v1/asset/0x913ae503153d9a335398d0785ba60a2d63ddb4e2/${i}/`).then(res => {
        console.log(res.data)
        setAssets(oldArray => [...oldArray, res.data]);
        makeOfferr(res.data.asset_contract.address, res.data.token_id, token.wallet, '0.001')
      })
    }
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
        <label>Your wallet</label>
        <input
          value={token.wallet}
          onChange={handleInputChange}
          name='wallet'
        />
      </form>
      <button onClick={getAsset}>Get Asset</button>
      <button onClick={makeOffer}>Make Offer</button>
      <button onClick={runBot}>Run Bot</button>
      <div>
        {assets.map((asset) => (

          <div key={asset.token_id}>
            <br />
            <div>ID: {asset.token_id}</div>
            <div>{asset.asset_contract.address}</div>
            <div>{asset.name}</div>
            <br />
          </div>

        ))}
      </div>
    </div>
  )
}
