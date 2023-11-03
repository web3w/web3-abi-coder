import Seaport from "./abi/Seaport.json"
import {ERC1155ABI, ERC721ABI, ERC20ABI, ERC20Coder, ERC721Coder} from "../index";
import {getBlockByNumber, getTransactionReceipt} from "../src/ethRPC";

(async () => {

    // const rpcUrl = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    const rpcUrl = "https://api.element.market/api/v1/jsonrpc"
    const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"
    const blockNum = 10862111 //"0xa5be1f"
    const coder = ERC20Coder.addABI(ERC721ABI).addABI(ERC1155ABI).addABI(Seaport.abi)

    const {result: block} = await getBlockByNumber(blockNum,rpcUrl)
    console.log(coder.decodeBlock(block))

    const {result: receipt} = await getTransactionReceipt(txHash,rpcUrl)
    console.log(coder.decodeTransactionReceipt(receipt))
})()
