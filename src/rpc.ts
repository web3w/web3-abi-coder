//// const res = await fetch('https://api.belo.app/public/price');


export async function fetchRPC(url: string, body: string) {
    const res = await fetch(url, {
            method: 'POST',
            body,
            headers: {'Content-Type': 'application/json'}
        }
    );
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Fatch Error")
    }
}

const rpcUrl = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"

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
