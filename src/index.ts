import {AbiCoder, Fragment, Interface, JsonFragment} from "@ethersproject/abi";
import {arrayify, concat, hexlify} from "@ethersproject/bytes";
import pkg from "../package.json"
import {estimateGas} from "./ethRPC";

export type {Fragment, JsonFragment}

export function bnToString(obj: object) {
    let res = {}
    if (Array.isArray(obj) && obj.length == 0) return []
    for (let key in obj) {
        // if (key == 'x') {
        //     debugger
        // }
        // @ts-ignore
        const values = Object.values(obj)

        // @ts-ignore
        if (obj.length > 0 && values.length == obj.length) {
            const items = []
            // @ts-ignore
            for (let item of obj) {
                if (item._isBigNumber) {
                    // @ts-ignore
                    items.push(item.toString())
                } else {
                    if (typeof item == 'string' || typeof item == 'number') {
                        // @ts-ignore
                        items.push(item)
                    } else {
                        // @ts-ignore
                        items.push(bnToString(item))
                    }
                }

            }
            res = items
        }
        // @ts-ignore
        if (Number(key) < obj.length) continue
        if (typeof (obj[key]) == "object") {
            if (obj[key]._isBigNumber) {
                res[key] = obj[key].toString()
            } else {
                res[key] = bnToString(obj[key]);
            }
        } else {
            res[key] = obj[key]
        }
    }
    return res
}

export type DecodeResult<T> = { name?: string, type: string, hash?: string, values: T }

export class Web3ABICoder extends Interface {
    public abiCode: AbiCoder
    public version = pkg.version

    constructor(abi: ReadonlyArray<Fragment | JsonFragment>) {
        super(abi);
        this.abiCode = this._abiCoder
    }

    addABI(abi: ReadonlyArray<Fragment | JsonFragment>): Web3ABICoder {
        const funcAbis = this.fragments.map(val => val.format())
        const newFace = new Interface(abi)
        const newAbi = newFace.fragments.filter(val => val.type != 'constructor' && funcAbis.indexOf(val.format()) < 0)
        const abiAll = [...this.fragments, ...newAbi]
        return new Web3ABICoder(abiAll)
    }

    getFunctionName(sighash: string): string {
        const funcAbi = this.getFunction(sighash)
        return funcAbi.name
    }

    getFunctionSelector(name: string): { name: string, signature: string, sighash: string }[] {
        const funcAbis = this.fragments.filter(val => val.type === 'function' && val.name == name)
        return funcAbis.map(val => ({
            name: val.name,
            signature: val.format(),
            sighash: this.getSighash(val)
        }))
    }

    getFunctionSelectors(): { name: string, signature: string, sighash: string }[] {
        const funcAbis = this.fragments.filter(val => val.type === 'function')
        return funcAbis.map(val => ({
            name: val.name,
            signature: val.format(),
            sighash: this.getSighash(val)
        }))
    }

    getFunctionSignature(name: string, type?: "minimal" | "json" | "full"): string[] {
        const funcAbis = this.fragments.filter(val => val.type === 'function' && val.name == name)
        return funcAbis.map(val => val.format(type))
    }

    getEvents(): { name: string, signature: string, topic: string }[] {
        const eventAbis = this.fragments.filter(val => val.type === 'event')
        return eventAbis.map(val => ({
            name: val.name,
            signature: val.format(),
            topic: this.getEventTopic(val.name)
        }))
    }

    decodeLog<T>(log: { topics: string[], data: string }): DecodeResult<T> {
        if (log.topics.length == 0) throw new Error("Topics data is incorrect: " + log.topics)

        if (log.topics.length == 1 && log.topics[0] == "0x6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be770") {
            // return PaymentReceived(address,uint256)
            const data = this.abiCode.decode(["address", "uint256"], log.data)
            const values = <T><unknown>{
                account: data[0],
                value: data[1].toString()
            }
            return {name: "PaymentReceived", type: "event", values}
        }
        const topicId = log.topics[0]


        try {
            const event = this.getEvent(<string>topicId)
            if (log.data == "0x") {
                event.inputs.forEach((val, index) => {
                    if (!val.indexed) {
                        log.data = log.topics[index + 1]
                    }
                })
            }
            const decodeData = this.decodeEventLog(event, log.data, log.topics)
            const values = bnToString(decodeData)
            return {name: event.name, type: event.type, values: <T>values}
        } catch (e) {
            return {name: "Error", type: "undecoded", values: <T><unknown>{topics: log.topics, data: log.data}}
        }

    }

    encodeInput(nameOrSighash: string, inputs: any[]): string {
        return this.encodeFunctionData(nameOrSighash, inputs)
    }

    encodeInputParams(nameOrSighash: string, values: any[]): string {
        const functionFragment = this.getFunction(nameOrSighash);
        return hexlify(
            this._encodeParams(functionFragment.inputs, values || [])
        );
    }

    decodeInput<T>(inputData: string): DecodeResult<T> {
        if (inputData.length < 10) throw new Error("Input data is incorrect: " + inputData)
        const sighash = inputData.substring(0, 10)
        const func = this.getFunction(sighash)
        if (!func) throw new Error("The ABI has no matching function:" + sighash)
        const decodeData = this.decodeFunctionData(func.name, inputData)
        const values = bnToString(decodeData);
        return {name: func.name, type: func.type, values: <T>values}
    }

    decodeInputParams<T>(nameOrSighash: string, paramsData: string): DecodeResult<T> {
        const func = this.getFunction(nameOrSighash)
        if (!func) throw new Error("The ABI has no matching function:" + nameOrSighash)
        const bytes = arrayify(paramsData);
        const decodeData = this._decodeParams(func.inputs, bytes);
        const values = bnToString(decodeData);
        return {name: func.name, type: func.type, values: <T>values}
    }

    decodeOutput<T>(nameOrSighash: string, outputData: string): DecodeResult<T> {
        const func = this.getFunction(nameOrSighash)
        if (!func) throw new Error("The ABI has no matching function:")
        const decodeData = this.decodeFunctionResult(func.name, outputData)
        const values = bnToString(decodeData)
        return {name: func.name, type: func.type, values: <T>values}
    }

    decodeBlock<T>(block): DecodeResult<T>[] {
        const funcIds = this.getFunctionSelectors()
        const validInputs = block.transactions.filter(tx => {
            if (tx.input.length > 10) {
                const methodId = tx.input.substring(0, 10)
                return funcIds.find(val => val.sighash == methodId) ? true : false
            } else {
                return false
            }
        })
        return validInputs.map(tx => ({...this.decodeInput(tx.input), hash: tx.hash}))
    }

    decodeTransaction<T>(transaction): DecodeResult<T> {
        return this.decodeInput(transaction.input)
    }

    decodeTransactionReceipt<T>(receipt): DecodeResult<T>[] {
        const evetns = this.getEvents()
        const validLogs = receipt.logs.filter(log => {
            if (log.topics.length > 0) {
                const topic = log.topics[0]
                return evetns.find(val => val.topic == topic) ? true : false
            } else {
                return false
            }
        })

        return validLogs.map(log => ({...this.decodeLog(log), hash: log.transactionHash}))
    }

    decodeConstructor<T>(data: string): DecodeResult<T> {
        const hex = data.substring(0, 2)
        if (hex == "00") {
            data = "0x" + data
        }
        const params = this.abiCode.decode(this.deploy.inputs, data)
        const values = <T>bnToString(params)
        return {name: "", type: 'constructor', values};
    }

    static async getHexCodeGas(data: {
        to: string,
        hexCode: string,
        value?: string
        url?: string
    }) {
        const {to, hexCode, value, url} = data
        return estimateGas({to, data: hexCode, value}, url)
    }

}

