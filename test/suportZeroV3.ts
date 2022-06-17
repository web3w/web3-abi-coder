import {Web3ABICoder} from "../src/index";
import {ERC1155_METHOD_ABI, ERC20_METHOD_ABI, ERC721_METHOD_ABI} from "./abi/zeroV3Abi";

const coder = new Web3ABICoder([ERC20_METHOD_ABI, ERC721_METHOD_ABI, ERC1155_METHOD_ABI])

console.log("------------ Zero V3 ----------------")
// // ----------- ERC20 Data---------
const erc20Data = "0xf47261b0000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
const erc20Name = ERC20_METHOD_ABI.name || ""
const erc20SigHash = coder.getFunctionSelector(erc20Name)
const erc20Address = coder.decodeInput(erc20Data).values['tokenContract']
const erc20EnCode = coder.encodeInput(erc20Name, [erc20Address])
console.log(erc20Name, erc20SigHash, "tokenContract", erc20Address)
console.assert(erc20Data == erc20EnCode)

// // ----------- ERC721 Data--------------
const erc721Data = "0x025717920000000000000000000000007ad9014955352638ae3d4036c9e43009117b88710000000000000000000000000000000000000000000000000000000000000d9b"
const erc721Name = ERC721_METHOD_ABI.name || ""
const asset721 = coder.decodeInput(erc721Data)
const erc721SigHash = coder.getFunctionSelector(erc721Name)
const tokenAddress721 = asset721.values['tokenContract']
const tokenId = asset721.values['tokenId']
console.log(erc721Name, erc721SigHash, "tokenContract", tokenAddress721, "tokenId", tokenId)
const erc721EnCode = coder.encodeInput(erc721Name, [tokenAddress721, tokenId])
console.assert(erc721Data == erc721EnCode)


// ----------- ERC1155 Data--------------
const erc1155Data = "0xa7cb5fb7000000000000000000000000991a868aa7b0a9a24565ede2d8fe758874a6a217000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000"
const erc1155Name = ERC1155_METHOD_ABI.name || ""
const erc1155SigHash = coder.getFunctionSelector(erc1155Name)
const asset1155 = coder.decodeInput(erc1155Data)
const asset1155Address = asset1155.values['tokenAddress']
const asset1155Ids = asset1155.values['tokenIds']
const asset1155Values = asset1155.values['tokenValues']
console.log(erc1155Name, erc1155SigHash, "tokenAddress", asset1155Address, "tokenIds", asset1155Ids, "tokenValues", asset1155Values)
const erc1155Encode = coder.encodeInput(erc1155Name, [asset1155Address, asset1155Ids, asset1155Values, "0x"])
console.assert(erc1155Data == erc1155Encode)


