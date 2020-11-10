
import async from 'async';
import config from "./config";
import {
  GET_FEEDS,
  FEEDS_UPDATED,
  FEEDS_RETURNED,
} from '../constants';

import { ERC20ABI } from "./abi/erc20ABI";
import { CheeseSwapOracleABI } from './abi/cheeseswapOracleABI';
import { CheeseSwapPairABI } from './abi/cheeseswapPairABI';

import Web3 from 'web3';
const web3 = new Web3(config.provider)

const rp = require('request-promise');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      assets: [
        {
          address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          decimals: "18",
          symbol: "WBNB",
          price_id: 'binance-coin',
        },
        {
          address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
          decimals: "18",
          symbol: "USDC",
          price_id: 'usd-coin'
        },
        {
          address: "0x55d398326f99059fF775485246999027B3197955",
          decimals: "18",
          symbol: "USDT",
          price_id: 'tether'
        },
        {
          address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
          decimals: "18",
          symbol: "DAI",
          price_id: 'dai',
        },
       
        {
          address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          decimals: "18",
          symbol: "BUSD",
          price_id: 'binance-usd',
        },
        {
          address: "0x1092E4F72a9D7a28418351D029e273906aF24797",
          decimals: "18",
          symbol: "KP3RB",
          price_id: 'uniswap',
        },
        {
          address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
          decimals: "18",
          symbol: "Cake",
          price_id: 'pancakeswap',
        },
        {
          address: "0xaDD8A06fd58761A5047426e160B2B88AD3B9D464",
          decimals: "18",
          symbol: "CHS",
          price_id: 'pancakeswap',
        },
        
         ],
      priceFeeds: [

      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_FEEDS:
            this.getFeeds(payload);
            break;
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit('StoreUpdated');
  };


  //get pairs




  // get hard-coded address to { decimals, name, icon }
  // populate pair token info
  // get missing pair token info
    // retunr temp data

  // get consult pricing
  // get coingecko USD/ETH pricing


  getFeeds = async () => {
    try {
      const cheeseswapOracleContract = new web3.eth.Contract(CheeseSwapOracleABI, config.cheeseswaporacleAddress)
      const pairs = await cheeseswapOracleContract.methods.pairs().call({})

      if(!pairs || pairs.length === 0) {
        return emitter.emit(FEEDS_RETURNED)
      }

      store.setStore({ feeds: pairs })
      emitter.emit(FEEDS_UPDATED)


      const usdPrices = await this._getUSDPrices()
      console.log(usdPrices)

      async.map(pairs, async (pair, callback) => {

        let pairPopulated = await this._populatePairsTokens(pair)
        pairPopulated.address = pair

        console.log(pairPopulated)

        let consult = await this._getConsult(pairPopulated)
        pairPopulated.consult = consult
        console.log(consult)

        let lastUpdated = await this._getLastUpdated(pairPopulated)
        pairPopulated.lastUpdated = lastUpdated
        console.log(lastUpdated)

        const usdPrice0 = usdPrices[pairPopulated.token0.price_id]
        const usdPrice1 = usdPrices[pairPopulated.token1.price_id]

        if(usdPrice0) {
          pairPopulated.priceToken0 = usdPrice0.usd
        }
        if(usdPrice1) {
          pairPopulated.priceToken1 = usdPrice1.usd
        }

        if (callback) {
          callback(null, pairPopulated)
        } else {
          return pairPopulated
        }
      }, (err, pairsData) => {
        if(err) {
          console.log(err)
        }
        console.log(pairsData)
        store.setStore({ feeds: pairsData })
        emitter.emit(FEEDS_RETURNED)
      })

    } catch(e) {
      console.log(e)
      return {}
    }
  }

  _populatePairsTokens = async (pair) => {
    try {
      const assets = store.getStore('assets')

      const cheeseswapPairContract = new web3.eth.Contract(CheeseSwapPairABI, pair)
      const token0Address = await cheeseswapPairContract.methods.token0().call({ })
      const token1Address = await cheeseswapPairContract.methods.token1().call({ })

      let token0 = null
      let token1 = null

      let token0Data = assets.filter((asset) => {
        return asset.address.toLowerCase() === token0Address.toLowerCase()
      })

      if(token0Data.length > 0) {
        token0 = token0Data[0]
      } else {
        const token0Contract = new web3.eth.Contract(ERC20ABI, token0Address)

        token0 = {
          address: token0Address,
          symbol: await token0Contract.methods.symbol().call({}),
          decimals: await token0Contract.methods.decimals().call({})
        }
      }


      let token1Data = assets.filter((asset) => {
        return asset.address.toLowerCase() === token1Address.toLowerCase()
      })

      if(token1Data.length > 0) {
        token1 = token1Data[0]
      } else {
        const token1Contract = new web3.eth.Contract(ERC20ABI, token1Address)

        token1 = {
          address: token1Address,
          symbol: await token1Contract.methods.symbol().call({}),
          decimals: await token1Contract.methods.decimals().call({})
        }
      }
      if (token0.symbol == "WBNB") {
      console.log(token0);
        return {
          token0: token1,
          token1: token0
        }
      } else {
        return {
          token0,
          token1
        }
      }
    } catch(ex) {
      console.log(ex)
      console.log(pair)
      return {
        token0: {},
        token1: {},
        error: ex
      }
    }

  }

  _getConsult = async (pair) => {
    try {

      const cheeseswapOracleContract = new web3.eth.Contract(CheeseSwapOracleABI, config.unioracleAddress)

      let sendAmount0 = (10**pair.token0.decimals).toFixed(0)
      let sendAmount1 = (10**pair.token1.decimals).toFixed(0)

      const consult0To1 = await cheeseswapOracleContract.methods.consult(pair.token0.address, sendAmount0, pair.token1.address).call({ })
      const consult1To0 = await cheeseswapOracleContract.methods.consult(pair.token1.address, sendAmount1, pair.token0.address).call({ })

      return {
        consult0To1: consult0To1/10**pair.token1.decimals,
        consult1To0: consult1To0/10**pair.token0.decimals,
      }


    } catch(e) {
      return {
        consult0To1: null,
        consult1To0: null,
        err: e
      }
    }
  }

  _getLastUpdated = async (pair) => {
    try {
      const cheeseswapOracleContract = new web3.eth.Contract(CheeseSwapOracleABI, config.cheeseswaporacleAddress)

      const lastUpdated = await cheeseswapOracleContract.methods.lastUpdated(pair.address).call({ })

      return lastUpdated
    } catch(e) {
      return 0
    }
  }

  _getUSDPrices = async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=dai,usd-coin,binance-coin,tether,binance-usd,wrapped-bitcoin,ethereum,aave,uniswap,compound-governance-token,maker,havven,curve-dao-token,keep3rV1,link&vs_currencies=usd'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)

      console.log(priceJSON)

      return priceJSON
    } catch(e) {
      console.log(e)
      return null
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
