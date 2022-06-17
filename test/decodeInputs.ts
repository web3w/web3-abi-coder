//
import {Web3ABICoder} from "../src/index";
import Seaport from "./abi/Seaport.json"
import {fetchData} from "./utlis/fetchData";

(async () => {
    // const data = await fetchData("tx")
    // const inputData = data.result.input
    const seaCoder = new Web3ABICoder(Seaport.abi)
    const inputData = seaCoder.encodeInput("getCounter", ["0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"])
    console.log(inputData)

    const func = seaCoder.getFunctionName(inputData.substring(0,10))
    const decodeData = seaCoder.decodeInput(inputData)
    console.log(decodeData)



})()
