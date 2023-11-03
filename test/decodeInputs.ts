//
import {Web3ABICoder} from "../src/index";
import Seaport from "./abi/Seaport.json" 

(async () => {
    debugger
    const seaportCoder = new Web3ABICoder(Seaport.abi)
    const inputData = seaportCoder.encodeInput("getCounter", ["0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"])
    console.log(inputData)

    const funcName = seaportCoder.getFunctionName(inputData.substring(0, 10))
    const decodeData = seaportCoder.decodeInput(inputData)
    console.log(funcName, '\n', decodeData)
})()
