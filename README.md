# Web3 ABI Coder

Utils that encodes and decodes transactions and logs for evm.

## Motivation

To solve the problem of unreadable web3.js and Ethers decoder data.

## Features

* Readable result
* Function coding
* Event coding
* ERC20Coder,ERC721Coder, ERC1155Coder

## Installation

`npm install web-abi-coder`

## Example

```ts
import {Web3ABICoder,ERC20Coder} from 'web3-abi-coder';
import Seaport from "./abi/Seaport.json"
const seaCoder = new Web3ABICoder(Seaport.abi)
const inputData = seaCoder.encodeInput("getCounter", ["0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"])
const func = seaCoder.getFunctionName(inputData.substring(0,10))
const decodeData = seaCoder.decodeInput(inputData)
/*
{
  name: 'getCounter',
  type: 'function',
  values: { offerer: '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401' }
}

*/
```

```ts

const erc20Log = {
    data: "0x0000000000000000000000000000000000000000000000370c9b5ef669c35300",
    topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000b5cfcb4d4745cbbd252945856e1b6eaadcf2fc4e',
        '0x000000000000000000000000694c6aea9444876d4fa9375fc9089c370f8e9eda',
    ]
}
const sigHash = ERC20Coder.getFunctionSelector('totalSupply');
console.assert(sigHash == "0x18160ddd")
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
    * utils
        * getFunctionName(sighash: string):string
        * getFunctionSelector(name: string):string
        * getFunctionSelectors():{name:string,sighash:string}[]
        * getFunctionSignature(nameOrSighash: string, type?: "minimal" | "json" | "full"): string
        * getEvent(nameOrSignatureOrTopic: string): EventFragment
        * ...Interface
    * decoding
        * decodeLog(log: { topics: string[], data: string })
        * decodeInput(inputData: string)
        * decodeOutput(nameOrSighash: string, outputData: string)
        * ...Interface
    * encoding
        * encodeInput(nameOrSighash: string, inputs: any[]) 
        * ...Interface
