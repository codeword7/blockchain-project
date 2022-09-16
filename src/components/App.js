import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import config from "../config.json";
import { loadProvider, loadNetwork, loadAccount, loadTokens, loadExchange } from "../store/interactions";
import Navbar from './Navbar';

function App() {

  const dispatch = useDispatch();
  const loadBlockchainData = async () => {
    
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
    window.ethereum.on('accountsChanged', async() => {
      await loadAccount(provider, dispatch);
    })

    const NRJ = config[chainId].NRJ;
    const mETH = config[chainId].mETH;
    const exchangeConf = config[chainId].exchange;

    await loadTokens(provider, [NRJ.address, mETH.address], dispatch);
    await loadExchange(provider, exchangeConf.address, dispatch);
  }

  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
