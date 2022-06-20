import {Web3ABICoder} from "../src/index";
import {ERC1155_METHOD_ABI} from "./abi/zeroV3Abi";
import {ERC20Coder} from "../index";

type ERC1155Type = {
    tokenAddress: string,
    tokenIds: string[],
    tokenValues: string[]
}
const transferCallData = ERC20Coder.encodeInput("transfer", ["0xad47d554e3a527d5cb4712b79eabba4f6152abcd", "2"])
const transferValue = ERC20Coder.decodeInput(transferCallData)
console.log(transferValue)


const coder = new Web3ABICoder([ERC1155_METHOD_ABI])
const erc1155Name = ERC1155_METHOD_ABI.name || ""
const erc1155SigHash = coder.getFunctionSelector(erc1155Name)
const erc1155Encodes = coder.encodeInput(erc1155Name, ["0xad47d554e3a527d5cb4712b79eabba4f6152abcd", [1, 2, 3], [3, 2, 1], "0x"])

const asset = coder.decodeInput<ERC1155Type>(erc1155Encodes)
const tokenAddress = asset.values.tokenAddress
const tokenIds = asset.values.tokenIds
const tokenValues = asset.values.tokenValues
console.log(erc1155Name, erc1155SigHash, "tokenAddress", tokenAddress, "tokenIds", tokenIds, "tokenValues", tokenValues)
//
