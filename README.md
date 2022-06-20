# Web3 ABI Coder

Utils that encodes and decodes transactions and logs for evm.

## Motivation

To solve the problem of unreadable web3.js and Ethers decoder data.

## Features

* Readable result
* Input data decode
* Logs decode
* ERC20Coder,ERC721Coder, ERC1155Coder
* Block tx decode
* Receipt decode

## Installation

`npm i web3-abi-coder`

## Example

### decodeInput

```ts
import {Web3ABICoder, ERC20Coder} from 'web3-abi-coder';
import Seaport from "./abi/Seaport.json"

const seaCoder = new Web3ABICoder(Seaport.abi)
const inputData = seaCoder.encodeInput("getCounter", ["0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"])
const func = seaCoder.getFunctionName(inputData.substring(0, 10))
const decodeData = seaCoder.decodeInput(inputData)
/*
{
  name: 'getCounter',
  type: 'function',
  values: { offerer: '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401' }
}

*/
```

### decodeLog

```ts

const erc20Log = {
    data: "0x0000000000000000000000000000000000000000000000370c9b5ef669c35300",
    topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000b5cfcb4d4745cbbd252945856e1b6eaadcf2fc4e',
        '0x000000000000000000000000694c6aea9444876d4fa9375fc9089c370f8e9eda',
    ]
} 
const erc20LogData = ERC20Coder.decodeLog(erc20Log)
console.log(erc20LogData)
/*
{
  name: 'Transfer',
  type: 'event',
  values: {
    from: '0xb5CFcb4D4745cBBD252945856E1B6eaadCf2fC4E',
    to: '0x694c6aea9444876d4fA9375fC9089C370F8E9edA',
    value: '1015479348216300000000'
  }
}
*/ 
```

### decodeBlock

```ts
import {fetchData} from "./utlis/fetchData";
import Seaport from "./abi/Seaport.json"
import {ERC1155ABI, ERC721ABI, ERC20Coder, getBlockByNumber, getTransactionReceipt} from 'web3-abi-coder';

const blockNum = 10862111 //"0xa5be1f"
const coder = ERC20Coder.addABI(ERC721ABI).addABI(ERC1155ABI).addABI(Seaport.abi)
const {result: block} = await getBlockByNumber(blockNum)
console.log(coder.decodeBlock(block))
/*
[
  {
    name: 'approve',
    type: 'function',
    values: {
      spender: '0xf2450ae4A2FEdC654C48f5FC1FdF596D05007761',
      amount: '200000000000000000000'
    },
    hash: '0x7f6c78ecac73137076d10429905c5c45b47bde030035f614601a3a1983c2e822'
  },
  {
    name: 'fulfillAdvancedOrder',
    type: 'function',
    values: {
      advancedOrder: [Object],
      criteriaResolvers: [],
      fulfillerConduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
      recipient: '0xcBE352f2559fe4209DDa6Ee2779cE254d2347d91'
    },
    hash: '0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6'
  },
  ...
]
* */
```

### decodeReceipt

```ts
const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"
const coder = ERC20Coder.addABI(ERC721ABI).addABI(ERC1155ABI).addABI(Seaport.abi)
const {result: receipt} = await getTransactionReceipt(txHash)
console.log(coder.decodeReceipt(receipt))
/*[
  {
    name: 'Transfer',
    type: 'event',
    values: {
      from: '0x9226f7dF5E316df051F0490cE3b753c51695D0Bb',
      to: '0xcBE352f2559fe4209DDa6Ee2779cE254d2347d91',
      amount: '1'
    },
    hash: '0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6'
  },
  {
    name: 'OrderFulfilled',
    type: 'event',
    values: {
      orderHash: '0xf9fc6150b8befdda825b0e6bdd8723105e010b32c67b1c2f9fc5b053d55b3d70',
      offerer: '0x9226f7dF5E316df051F0490cE3b753c51695D0Bb',
      zone: '0x00000000E88FE2628EbC5DA81d2b3CeaD633E89e',
      recipient: '0xcBE352f2559fe4209DDa6Ee2779cE254d2347d91',
      offer: [Array],
      consideration: [Array]
    },
    hash: '0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6'
  }
]
*/
```

### encodeInput

```ts

const transferCallData = ERC20Coder.encodeInput("transfer", ["0xad47d554e3a527d5cb4712b79eabba4f6152abcd", "2"])
const transferValue = ERC20Coder.decodeInput(transferCallData)
console.log(transferValue)
/*
{ 
    name: 'transfer',
    type: 'function',
    values: { to: '0xAD47D554E3A527D5Cb4712B79EaBBA4f6152abCd', amount: '2' }
}
*/
```

## API

* Web3ABICoder(abi) extends Interface
    * abi
        * ERC20ABI,ERC721,ERC1155
        * addABI(abi: ReadonlyArray<Fragment | JsonFragment>): Web3ABICoder
        * ...abiCoder
    * utils
        * getFunctionName(sighash: string):string
        * getFunctionSelector(name: string): { name: string, signature: string, sighash: string }[]
        * getFunctionSelectors(): { name: string, signature: string, sighash: string }[]
        * getFunctionSignature(name: string, type?: "minimal" | "json" | "full"): string[]
        * getEvent(nameOrSignatureOrTopic: string): EventFragment
        * getEvents(): { name: string, signature: string, topic: string }
        * ...Interface
    * decoding
        * decodeConstructor<T>(data: string): DecodeResult<T>
        * decodeInput<T>(inputData: string): DecodeResult<T>
        * decodeLog<T>(log: { topics: string[], data: string }): DecodeResult<T>
        * decodeOutput<T>(nameOrSighash: string, outputData: string): DecodeResult<T>
        * decodeBlock<T>(block): DecodeResult<T>[]
        * decodeReceipt<T>(receipt): DecodeResult<T>[]
        * ...Interface
    * encoding
        * encodeInput(nameOrSighash: string, inputs: any[])
        * ...Interface
* Rpc function
    * async function getBlockByNumber(blockNum: number, url?: string)
    * async function getTransactionByHash(txHash: string, url?: string)
    * async function getTransactionReceipt(txHash: string, url?: string)
