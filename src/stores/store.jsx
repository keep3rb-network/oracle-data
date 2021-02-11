
import async from 'async';
import config from "./config";
import {
  GET_FEEDS,
  FEEDS_UPDATED,
  FEEDS_RETURNED,
} from '../constants';

import { ERC20ABI } from "./abi/erc20ABI";
import { CheeseSwapPairABI } from './abi/cheeseswapPairABI';
import { Keep3rbOracleABI } from './abi/keep3rbOracleABI'

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
          address: "0x5EA29eEe799aA7cC379FdE5cf370BC24f2Ea7c81",
          decimals: "18",
          symbol: "KP3RB",
          price_id: 'keep3r-bsc-network',
        },
        {
          address: "0xaDD8A06fd58761A5047426e160B2B88AD3B9D464",
          decimals: "18",
          symbol: "CHS",
          price_id: 'cheeseswap',
        },
        ],
      priceFeeds: [

      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          default:case GET_FEEDS:
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
      const uniOracleContract = new web3.eth.Contract(Keep3rbOracleABI, config.keep3rbOracleAddress)
      const pairs = await uniOracleContract.methods.pairs().call({})

      if(!pairs || pairs.length === 0) {
        return emitter.emit(FEEDS_RETURNED)
      }

      store.setStore({ feeds: pairs })
      emitter.emit(FEEDS_UPDATED)

      const usdPrices = await this._getUSDPrices()

      async.map(pairs, async (pair, callback) => {

        let pairPopulated = await this._populatePairsTokens(pair)
        pairPopulated.address = pair

        let consult = await this._getConsult(pairPopulated)
        pairPopulated.consult = consult

        let lastUpdated = await this._getLastUpdated(pairPopulated)
        pairPopulated.lastUpdated = lastUpdated.timestamp

        let volatility = await this._getVolatility(pairPopulated)
        pairPopulated.volatility = volatility

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
      if (token0.symbol === "WBNB") {
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

      const uniOracleContract = new web3.eth.Contract(Keep3rbOracleABI, config.keep3rbOracleAddress)

      let sendAmount0 = (10**pair.token0.decimals).toFixed(0)
      let sendAmount1 = (10**pair.token1.decimals).toFixed(0)

      const consult0To1 = await uniOracleContract.methods.current(pair.token0.address, sendAmount0, pair.token1.address).call({ })
      const consult1To0 = await uniOracleContract.methods.current(pair.token1.address, sendAmount1, pair.token0.address).call({ })

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
      const uniOracleContract = new web3.eth.Contract(Keep3rbOracleABI, config.keep3rbOracleAddress)

      const lastUpdated = await uniOracleContract.methods.lastObservation(pair.address).call({ })

      return lastUpdated
    } catch(e) {
      return { timestamp: 0 }
    }
  }

  _getVolatility = async (pair) => {
    const keep3rbOracleContract = new web3.eth.Contract(Keep3rbOracleABI, config.keep3rbOracleAddress)
    const sendAmount = (10**pair.token0.decimals).toFixed(0)

    try {
      const realizedVolatilityHourly = await keep3rbOracleContract.methods.realizedVolatilityHourly(pair.token0.address, sendAmount, pair.token1.address).call({ })
      const realizedVolatilityDaily = await keep3rbOracleContract.methods.realizedVolatilityDaily(pair.token0.address, sendAmount, pair.token1.address).call({ })
      const realizedVolatilityWeekly = await keep3rbOracleContract.methods.realizedVolatilityWeekly(pair.token0.address, sendAmount, pair.token1.address).call({ })

      return {
        realizedVolatilityHourly: realizedVolatilityHourly/1e18,
        realizedVolatilityDaily: realizedVolatilityDaily/1e18,
        realizedVolatilityWeekly: realizedVolatilityWeekly/1e18 }
    } catch(e) {
      console.log(e)

      try {
        const realizedVolatility = await keep3rbOracleContract.methods.realizedVolatility(pair.token0.address, sendAmount, pair.token1.address, 24, 2).call({ })

        return {
          realizedVolatility: realizedVolatility/1e18,
          realizedVolatilityHourly: null,
          realizedVolatilityDaily: null,
          realizedVolatilityWeekly: null,
        }
      } catch(ex) {
        console.log(ex)
        return {
          realizedVolatility: null,
          realizedVolatilityHourly: null,
          realizedVolatilityDaily: null,
          realizedVolatilityWeekly: null,
          err: ex
        }
      }
    }
  }

  _getUSDPrices = async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=dai,binance-coin,binance-usd,tether,usd-coin,cheeseswap,keep3r-bsc-network,link&vs_currencies=usd'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)

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
