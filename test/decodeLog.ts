//
import {ERC20Coder, ERC721Coder, Web3ABICoder} from "../index";
import Seaport from "./abi/Seaport.json"
import {fetchData} from "./utlis/fetchData";

(async () => {
    const erc20Log = {
        data: "0x0000000000000000000000000000000000000000000000370c9b5ef669c35300",
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x000000000000000000000000b5cfcb4d4745cbbd252945856e1b6eaadcf2fc4e',
            '0x000000000000000000000000694c6aea9444876d4fa9375fc9089c370f8e9eda',
        ]
    }
    const sigHash = ERC20Coder.getFunctionSelector('totalSupply');
    console.assert(sigHash == "0x18160ddd")
    const erc20LogData = ERC20Coder.decodeLog(erc20Log)
    console.log("ERC20", erc20LogData)


    const seaportCoder = new Web3ABICoder(Seaport.abi)
    const data = await fetchData("receipt")
    // console.log(data.result.logs);
    const erc721log = data.result.logs[0]
    const seaportlog = data.result.logs[1]

    const erc721Event = ERC721Coder.getEvent(erc721log.topics[0])
    const seaEvent = seaportCoder.getEvent(seaportlog.topics[0])
    console.log("Event Name: ", erc721Event.name, seaEvent.name)
    const hash = ERC721Coder.getEventTopic(erc721Event.name)
    console.assert(hash == erc721log.topics[0])
    const erc721Log = ERC721Coder.decodeLog(erc721log)
    console.log("ERC721", erc721Log)

    const seaportLog = seaportCoder.decodeLog(seaportlog)
    console.log("Seaport", JSON.stringify(seaportLog, null, 2))
})()
