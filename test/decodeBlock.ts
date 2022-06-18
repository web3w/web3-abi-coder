import {fetchData} from "./utlis/fetchData";
import Seaport from "./abi/Seaport.json"
import {ERC1155ABI, ERC721ABI, ERC20ABI, ERC20Coder, ERC721Coder} from "../index";

(async () => {
    //0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
    const coder = ERC20Coder.addABI(ERC721ABI).addABI(ERC1155ABI).addABI(Seaport.abi)
    const {result: receipt} = await fetchData("receipt")
    console.log(coder.decodeReceipt(receipt))

    const {result: block} = await fetchData("block")
    console.log(coder.decodeBlock(block))
})()
