//
import { Web3ABICoder } from "../index";
import Titanx from "./abi/Titanx.json"
import TitanxBuy from "./abi/TitanxBuy.json"
import Multicall3 from "./abi/Multicall3.json"

const multicall3 = new Web3ABICoder(Multicall3.abi)
const titanxCoder = new Web3ABICoder(Titanx.abi)
const titanxBuyCoder = new Web3ABICoder(TitanxBuy.abi)
const TitanxAddress = "0xF19308F923582A6f7c465e5CE7a9Dc1BEC6665B1"
const BuyAndBurnAddress = "0x1393ad734EA3c52865b4B541cf049dafd25c23a5"

function getMulticall(hex:string){ 
    const multicall = multicall3.decodeInput(hex)
    console.log('\n', 'Titanx_alchemy_id17', multicall.name)
    // @ts-ignore
    for (let call of multicall.values.calls) {
        // console.log(call)
        let func
        if(call.callData.length >2 ){
            if(call.target == TitanxAddress) {
                func = titanxCoder.decodeInput(call.callData)
            }else if(call.target == BuyAndBurnAddress){
                func = titanxBuyCoder.decodeInput(call.callData)
            }
           
            console.log(func)
        }else{
            console.log('Titanx_alchemy_id17',call.callData )
        }
       
    }
}

(async () => {
    //Multicall 0xca11bde05977b3631167028862be2a173976ca11

    const titanxInput = getMulticall(Multicall3.alchemy_id1)
   

    //Titanx 0xF19308F923582A6f7c465e5CE7a9Dc1BEC6665B1
    const alchemy_id1 = multicall3.decodeInput(Multicall3.alchemy_id1)
    const alchemy_id2 = multicall3.decodeInput(Multicall3.alchemy_id2)
    const alchemy_id3 = multicall3.decodeInput(Multicall3.alchemy_id3)
    const alchemy_id4 = multicall3.decodeInput(Multicall3.alchemy_id4)
    const alchemy_id5 = multicall3.decodeInput(Multicall3.alchemy_id5) 
    const alchemy_id6 = multicall3.decodeInput(Multicall3.alchemy_id6)
    const alchemy_id7 = multicall3.decodeInput(Multicall3.alchemy_id7)
    const alchemy_id8 = multicall3.decodeInput(Multicall3.alchemy_id8)
    const alchemy_id11 = multicall3.decodeInput(Multicall3.alchemy_id11)
  
    const alchemy_id14 = multicall3.decodeInput(Multicall3.alchemy_id14)
    const alchemy_id15 = multicall3.decodeInput(Multicall3.alchemy_id15)
    const alchemy_id16 = multicall3.decodeInput(Multicall3.alchemy_id16) 
    const alchemy_id17 = multicall3.decodeInput(Multicall3.alchemy_id17)
    const alchemy_id18 = multicall3.decodeInput(Multicall3.alchemy_id18)



    //BuyAndBurn:  //0x1393ad734EA3c52865b4B541cf049dafd25c23a5
    const alchemy_id9 = multicall3.decodeInput(Multicall3.alchemy_id9)
    const alchemy_id12 = multicall3.decodeInput(Multicall3.alchemy_id12)

    const cloudflare = multicall3.decodeInput(Multicall3.cloudflare_eth)


    console.log('\n', 'titanxCoder', cloudflare.name)
    // @ts-ignore
    for (let call of cloudflare.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }


    console.log('\n', 'Titanx_alchemy_id18', alchemy_id18.name)
    // @ts-ignore
    for (let call of alchemy_id18.values.calls) {
        // console.log(call)
        if(call.callData.length >2){
            const titanxFun = titanxCoder.decodeInput(call.callData)
            console.log(titanxFun)
        }else{
            console.log('Titanx_alchemy_id18',call.callData )
        }
       
    }


    console.log('\n', 'Titanx_alchemy_id17', alchemy_id17.name)
    // @ts-ignore
    for (let call of alchemy_id17.values.calls) {
        // console.log(call)
        if(call.callData.length >2){
            const titanxFun = titanxCoder.decodeInput(call.callData)
            console.log(titanxFun)
        }else{
            console.log('Titanx_alchemy_id17',call.callData )
        }
       
    }
    
    console.log('\n', 'Titanx_alchemy_id15', alchemy_id15.name)
    // @ts-ignore
    for (let call of alchemy_id15.values.calls) {
        // console.log(call)
        if(call.callData.length >2){
            const titanxFun = titanxCoder.decodeInput(call.callData)
            console.log(titanxFun)
        }else{
            console.log('Titanx_alchemy_id15',call.callData )
        }
       
    }




    console.log('\n', 'Titanx_alchemy_id14', alchemy_id14.name)
    // @ts-ignore
    for (let call of alchemy_id14.values.calls) {
        // console.log(call)
        if(call.callData.length >2){
            const titanxFun = titanxCoder.decodeInput(call.callData)
            console.log(titanxFun)
        }else{
            console.log('Titanx_alchemy_id14',call.callData )
        }
       
    }


    console.log('\n', 'Titanx_alchemy_id16', alchemy_id16.name)
    // @ts-ignore
    for (let call of alchemy_id16.values.calls) {
        // console.log(call)
        if(call.callData.length >2){
            const titanxFun = titanxCoder.decodeInput(call.callData)
            console.log(titanxFun)
        }else{
            console.log('Titanx_alchemy_id16',call.callData )
        }
       
    }


     console.log('\n', 'Titanx_alchemy_id8', alchemy_id8.name)
    // @ts-ignore
    for (let call of alchemy_id8.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'Titanx_alchemy_id11', alchemy_id11.name)
    // @ts-ignore
    for (let call of alchemy_id11.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }
    console.log('\n', 'Titanx_alchemy_id1', alchemy_id1.name)
    // @ts-ignore
    for (let call of alchemy_id1.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'Titanx_alchemy_id6', alchemy_id6.name)
    // @ts-ignore
    for (let call of alchemy_id6.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }


    console.log('\n', 'Titanx_alchemy_id5', alchemy_id5.name)
    // @ts-ignore
    for (let call of alchemy_id5.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }


    console.log('\n', 'BuyAndBurn_alchemy_id12', alchemy_id12.name)
    // @ts-ignore
    for (let call of alchemy_id12.values.calls) {
        // console.log(call)
        const titanxFun = titanxBuyCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'BuyAndBurn_alchemy_id9', alchemy_id9.name,)
    // @ts-ignore
    for (let call of alchemy_id9.values.calls) {
        // console.log(call)
        const titanxFun = titanxBuyCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'alchemy_id2', alchemy_id2.name)
    // @ts-ignore
    for (let call of alchemy_id2.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'alchemy_id3', alchemy_id3.name)
    // @ts-ignore
    for (let call of alchemy_id3.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'alchemy_id4', alchemy_id4.name)
    // @ts-ignore
    for (let call of alchemy_id4.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }

    console.log('\n', 'alchemy_id7', alchemy_id7.name)
    // @ts-ignore
    for (let call of alchemy_id7.values.calls) {
        // console.log(call)
        const titanxFun = titanxCoder.decodeInput(call.callData)
        console.log(titanxFun)
    }



   
})()
