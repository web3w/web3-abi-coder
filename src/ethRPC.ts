//// const res = await fetch('https://api.belo.app/public/price');

import {fetchRPC} from "./utils";

const rpcUrl = "https://eth-mainnet.improd.works"


export async function getBlockByNumber(blockNum: number, url?: string) {
    const blockHex = "0x" + blockNum.toString(16)
    const getBlock = {
        "jsonrpc": "2.0",
        "method": "eth_getBlockByNumber",
        "params": [blockHex, true],
        "id": new Date().getTime()
    }
    return fetchRPC(url || rpcUrl, JSON.stringify(getBlock))
}

export async function getTransactionByHash(txHash: string, url?: string) {
    const getTxByHash = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": [txHash],
        "id": new Date().getTime()
    }
    return fetchRPC(url || rpcUrl, JSON.stringify(getTxByHash))
}

export async function getTransactionReceipt(txHash: string, url?: string) {
    const getReceipt = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionReceipt",
        "params": [txHash],
        "id": new Date().getTime()
    }
    return fetchRPC(url || rpcUrl, JSON.stringify(getReceipt))
}

export interface LimitedCallSpec {
    to: string;
    data: string;
    value?: string;
    from?: string;
}

export async function estimateGas(callData: LimitedCallSpec,url?: string, ) {
    if (callData.value && callData.value.toString().substr(0, 2) != '0x') {
        callData.value = '0x' + Number(callData.value.toString()).toString(16)
    }
    if(!callData.from){
        //https://etherscan.io/accounts
        callData.from ="0xda9dfa130df4de4673b89022ee50ff26f6ea73cf"
    }
    const estimate = {
        "jsonrpc": "2.0",
        "method": "eth_estimateGas",
        "params": [callData, 'latest'],
        "id": new Date().getTime()
    }
    const gasData = await fetchRPC(url || rpcUrl, JSON.stringify(estimate))
    if (gasData.result) {
        return Number(gasData.result).toString()
    } else {
        throw gasData.error
    }
}
