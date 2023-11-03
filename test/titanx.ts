//
import { Web3ABICoder } from "../index";
import Titanx from "./abi/Titanx.json"
import Multicall3 from "./abi/Multicall3.json"

(async () => {
    const titanxCoder = new Web3ABICoder(Multicall3.abi) 
    // const inputData = titanxCoder.getFunctionSelectors()
    const inputData = titanxCoder.decodeInput(Multicall3.datainput)
    console.log(inputData)

   
})()
