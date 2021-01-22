import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import { colors } from '../../theme'

const styles = theme => ({
  footer: {
    padding: '48px',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    background: colors.lightGray,
    borderTop: '1px solid rgba(235, 188, 37 , 0.9)',
    flexWrap: 'wrap',
    marginTop: '80px',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
      flexDirection: 'column'
    }
  },
  footerDis: {
  padding: '20px',
  display: 'flex',
  width: '100%',
  borderColor: colors.darkGray,
  color: colors.darkGray,
  background: colors.lightGray,
  flexWrap: 'wrap',
  borderTop: '1px solid '+colors.borderBlue,
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }
},
  heading: {
    marginBottom: '12px',
    paddingBottom: '9px',
    borderBottom: "3px solid "+colors.borderBlue,
    width: 'fit-content',
  },
  link: {
    paddingBottom: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  cplink: {
    paddingTop: '22px',
    paddingBottom: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    },
  icon: {
    fill: 'rgba(235, 188, 37 , 0.9)',
    marginRight: '6px'
  },
  yearnIcon: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  builtWith:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    }
  },
  builtWithLink: {
    paddingTop: '12px'
  },
  builtHeading: {
    marginBottom: '12px',
    paddingBottom: '9px',
    borderBottom: "3px solid "+colors.borderBlue,
    width: 'fit-content',
  },
  products: {
    padding: '0px 24px',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: '24px'
    }
  },
  community: {
    padding: '0px 24px',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: '24px'
    }
  },
  socials: {
    padding: '0px 24px'
  }
});

class Footer extends Component {

  constructor(props) {
    super()
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.footer}>

        <div className={ classes.products }>
          <Typography className={ classes.heading } variant={ 'h2'}>Documentation</Typography>
          <div  className={ classes.link } onClick={()=> window.open("https://docs.keep3rb.network/docs", "_blank")} >
            <img alt="" src={ require('../../assets/docs.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Docs</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://docs.keep3rb.network/registry", "_blank")} >
            <img alt="" src={ require('../../assets/registry.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Registry</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("/how-to-start", "_blank")} >
           <img alt="" src={ require('../../assets/guide.svg') } height='18px' className={ classes.icon } />
           <Typography variant={ 'h3'} >How to Start</Typography>
         </div>
          <div  className={ classes.link } onClick={()=> window.open("https://data.keep3rb.network", "_blank")} >
            <img alt="" src={ require('../../assets/data.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Oracle Data</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://github.com/keep3rb-network/assets/blob/main/docs/Keep3rb.pdf", "_blank")} >
            <img alt="" src={ require('../../assets/file.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >KP3RB Asset</Typography>
          </div>
        </div>
        <div className={ classes.products }>
          <Typography className={ classes.heading } variant={ 'h2'}>Useful Link</Typography>
          <div  className={ classes.link } onClick={()=> window.open("https://bscscan.com/token/0x5ea29eee799aa7cc379fde5cf370bc24f2ea7c81", "_blank")} >
            <img alt="" src={ require('../../assets/contract.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >KP3RB Contract</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://dappradar.com/binance-smart-chain/defi/keep3r-bsc-network", "_blank")} >
            <img alt="" src={ require('../../assets/data.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >DappRadar Data</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://coinmarketcap.com/currencies/keep3r-bsc-network/", "_blank")} >
            <img alt="" src={ require('../../assets/data.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >CoinMarketCap</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://www.coingecko.com/en/coins/keep3r-bsc-network", "_blank")} >
            <img alt="" src={ require('../../assets/data.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >CoinGecko</Typography>
          </div>
         </div>
          <div className={ classes.products }>
          <Typography className={ classes.heading } variant={ 'h2'}>KP3RB Trade</Typography>
          <div  className={ classes.link } onClick={()=> window.open("https://www.hotbit.io/exchange?symbol=KP3RB_USDT", "_blank")} >
          <img alt="" src={ require('../../assets/market.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Hotbit</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://cheeseswap.app/#/swap?inputCurrency=0x5ea29eee799aa7cc379fde5cf370bc24f2ea7c81&outputCurrency=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "_blank")} >
          <img alt="" src={ require('../../assets/market.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >CheeseSwap</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x5ea29eee799aa7cc379fde5cf370bc24f2ea7c81&outputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56", "_blank")} >
          <img alt="" src={ require('../../assets/market.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >PancakeSwap</Typography>
          </div>
        </div>
        <div className={ classes.products }>
          <Typography className={ classes.heading } variant={ 'h2'}>Social Media</Typography>
          <div  className={ classes.link } onClick={()=> window.open("mailto:info@keep3rb.network", "_blank")} >
          <img alt="" src={ require('../../assets/email.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Contact us</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://twitter.com/kp3rb", "_blank")} >
          <img alt="" src={ require('../../assets/twitter.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Twitter</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://t.me/keep3rb", "_blank")} >
          <img alt="" src={ require('../../assets/telegram.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Telegram</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://github.com/keep3rb-network", "_blank")} >
            <img alt="" src={ require('../../assets/github.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Github</Typography>
          </div>
          <div  className={ classes.link } onClick={()=> window.open("https://keep3rb.medium.com/", "_blank")} >
          <img alt="" src={ require('../../assets/medium.svg') } height='18px' className={ classes.icon } />
            <Typography variant={ 'h3'} >Medium</Typography>
          </div>
        </div>
        <div className={ classes.products }>
          <Typography className={ classes.heading } variant={ 'h2'}>Built on</Typography>
          <div  className={ classes.link } >
            <img alt="" src={ require('../../assets/img/built-on-bsc.svg') } height='42px' className={ classes.icon } />
          </div>
          <div  className={ classes.link } >
            <img alt="" src={ require('../../assets/img/defi-v3-keeper-network-bsc.svg') } height='42px' className={ classes.icon } />
          </div>
        </div>
        <div className={classes.footerDis}>
        A Concern of Keeper Network Ltd. | 71-75, Shelton Street, Covent Garden, London, UK, WC2H 9JQ. | Company Number: 13084173 | © 2020 All rights reserved.
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Footer);
