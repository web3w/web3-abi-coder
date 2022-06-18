import {ERC20ABI, ERC721ABI, ERC1155ABI} from "./src/abi"
import {Web3ABICoder, bnToString, Fragment, JsonFragment} from "./src/index";

export {Web3ABICoder, bnToString, ERC20ABI, ERC721ABI, ERC1155ABI}
export type {Fragment, JsonFragment}
export const ERC20Coder = new Web3ABICoder(ERC20ABI)
export const ERC721Coder = new Web3ABICoder(ERC721ABI)
export const ERC1155Coder = new Web3ABICoder(ERC1155ABI)
export {getTransactionByHash, getTransactionReceipt, getBlockByNumber, fetchRPC} from "./src/rpc"






