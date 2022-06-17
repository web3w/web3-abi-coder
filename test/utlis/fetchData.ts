export async function fetchData(type: "receipt" | "tx" | 'block' = "receipt") {
    // const res = await fetch('https://api.belo.app/public/price');
    const getTxByHash = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": ["0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"],
        "id": 1
    }
    const getBlock = {"jsonrpc": "2.0", "method": "eth_getBlockByNumber", "params": ["0xa5be1f", true], "id": 1}
    const getReceipt = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionReceipt",
        "params": ["0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"],
        "id": 1
    }
    const req = type == "receipt" ? getReceipt : type == "tx" ? getTxByHash : getBlock
    const res = await fetch("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        {
            method: 'POST',
            body: JSON.stringify(req),
            headers: {'Content-Type': 'application/json'}
        }
    );

    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Fatch Error")
    }
}
