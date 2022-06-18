//
import {Web3ABICoder} from "../src/index";
import Seaport from "./abi/Seaport.json"
import {ERC721Coder} from "../index";
import {getTransactionByHash, getTransactionReceipt} from "../src/rpc";

(async () => {
    const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"

    const seaportCoder = new Web3ABICoder(Seaport.abi)
    const txData = await getTransactionByHash(txHash)
    const inputData = txData.result.input
    const funcName = seaportCoder.getFunctionName(inputData.substring(0, 10))
    console.log("--------Seaport Function Name", funcName)
    const decodeData = seaportCoder.decodeInput(inputData)
    console.log(JSON.stringify(decodeData, null, 2))

    const data = await getTransactionReceipt(txHash)
    const erc721log = data.result.logs[0]
    const seaportlog = data.result.logs[1]
    const erc721Event = ERC721Coder.getEvent(erc721log.topics[0])
    const seaEvent = seaportCoder.getEvent(seaportlog.topics[0])
    console.log("--------ERC721 Event Name: ", erc721Event.name)
    const hash = ERC721Coder.getEventTopic(erc721Event.name)
    console.assert(hash == erc721log.topics[0])
    const erc721Log = ERC721Coder.decodeLog(erc721log)
    console.log(JSON.stringify(erc721Log, null, 2))

    console.log("--------Seaport Event Name: ", seaEvent.name)
    const seaportLog = seaportCoder.decodeLog(seaportlog)
    console.log(JSON.stringify(seaportLog, null, 2))
})()
