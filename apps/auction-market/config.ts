import { ChainId } from '@sushiswap/chain'
import { AddressMap } from '@sushiswap/core-sdk'


export const AUCTION_MAKER_ADDRESSES: AddressMap = {
  [ChainId.KOVAN]: '0x5300c2194eae4c5765a39b3c0877a40ce66c5539',
  [ChainId.GÖRLI]: '0x0000000000000000000000000000000000000000',
}


// TODO: Map with network config, minttl maxttl?


export const MIN_BID_AMOUNT = "1000"
export const MINIMUM_LP_BALANCE_THRESHOLD = '' // threshold value in ETH to to determine wether or not the lp should be unwinded 
// map chainId value, probably want different threshold on kovan for testing purposes