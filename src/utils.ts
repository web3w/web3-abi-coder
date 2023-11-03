import {ERC1155ABI, ERC721Coder} from "../index";

export interface Log {
    blockNumber: string;
    blockHash: string;
    transactionIndex: string;

    removed: boolean;

    address: string;
    data: string;

    topics: Array<string>;

    transactionHash: string;
    logIndex: string;
}

export interface ReceiptLogs {
    to: string;
    from: string;
    logs: Array<Log>,
};

export const getTransferEvents = (receipt: ReceiptLogs): {
    from: string,
    assetAddress: string,
    tokenId: string,
    amount: string,
    event?: string
}[] => {
    if (!receipt.from && !receipt.logs) throw new Error("Receipt error")
    const from = receipt.from.toLowerCase()
    const coder = ERC721Coder.addABI(ERC1155ABI)
    const logs: any[] = []
    const tranferEvents = ["Transfer", "TransferSingle", "TransferBatch"]
    for (const log of receipt.logs) {
        const data = coder.decodeLog<any>(log)
        if (data.type != "undecoded" && tranferEvents.some(val => val == data.name) && data?.values?.to?.toLowerCase() == from) {
            const assetAddress = log.address
            const amount = data.values.amount || "1"
            const tokenId = data.values.id
            logs.push({
                from,
                assetAddress,
                tokenId,
                amount,
                event: data.name
            })
        }
    }
    return logs
}


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

export async function get4Bytes(hash: string) {
    const url = "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/"
    // https://raw.githubusercontent.com/ethereum-lists/4bytes/master/with_parameter_names/a9059cbb
    const signFunc = await fetch(url + hash)
    return signFunc.text()
}

// https://docs.tenderly.co/simulations-and-forks/simulation-api
export async function getTenderlyGas(data: { input: string, to: string, from: string, value: string }, config?: { url: string, key: string }) {
    const {input, to, from, value} = data
    const callData = {
        input, to, from, value,
        "network_id": "1",
        "save": true,
        "save_if_fails": true,
        "simulation_type": "quick",
        "generate_access_list": true
    }

    const url = config?.url || "https://api.tenderly.co/api/v1/account/me/project/gem-aggregator/simulate"
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': config?.key || 'sduNMNsKx5ihVpZodjWVnWsP8odX1ZiI', //gem
        },
        body: JSON.stringify(callData)
    }

    const res = await fetch(url, opts);
    if (res.ok) {
        const result = await res.json()
        const callTrace = result.transaction.transaction_info.call_trace
        console.log("transaction", result.transaction.gas_used)
        const {gas_used, intrinsic_gas, refund_gas} = callTrace
        console.log("callTrace", gas_used, intrinsic_gas, refund_gas)
        if (!refund_gas) throw new Error('GetTenderlyGas error')
        return gas_used + refund_gas;
    } else {
        console.log(res.status)
        console.log(res.statusText)
        throw new Error("Fatch Error")
    }
}
