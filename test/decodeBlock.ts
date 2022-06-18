import {fetchData} from "./utlis/fetchData";
import Seaport from "./abi/Seaport.json"
import {ERC1155ABI, ERC721ABI, ERC20ABI, ERC20Coder, ERC721Coder} from "../index";
import {getBlockByNumber, getTransactionReceipt} from "../src/rpc";

(async () => {
    const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"
    const blockNum = 10862111 //"0xa5be1f"
    const coder = ERC20Coder.addABI(ERC721ABI).addABI(ERC1155ABI).addABI(Seaport.abi)
    const {result: receipt} = await getTransactionReceipt(txHash)
    console.log(coder.decodeReceipt(receipt))

    const {result: block} = await getBlockByNumber(blockNum)
    console.log(coder.decodeBlock(block))
})()
