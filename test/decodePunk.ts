import Seaport from "./abi/Seaport.json"
import Punk from "./abi/Punk.json"
import {ERC1155ABI, ERC721ABI, ERC20ABI, ERC20Coder, ERC721Coder} from "../index";
import {getBlockByNumber, getTransactionReceipt} from "../src/ethRPC";

(async () => {

    // const rpcUrl = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    const rpcUrl = "https://api.element.market/api/v1/jsonrpc"
    const txHash = "0x329c1cf28835340350a666688d0ee712c39de967bc2ed0fefab9ada6bdff5284"

    const coder = ERC20Coder.addABI(ERC721ABI).addABI(ERC1155ABI).addABI(Punk.abi)

    // const blockNum = 10862111 //"0xa5be1f"
    // const {result: block} = await getBlockByNumber(blockNum,rpcUrl)
    // console.log(coder.decodeBlock(block))

    const {result: receipt} = await getTransactionReceipt(txHash,rpcUrl)
    console.log(coder.decodeTransactionReceipt(receipt))
})()
