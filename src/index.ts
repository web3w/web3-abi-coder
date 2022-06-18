import {AbiCoder, Fragment, Interface, JsonFragment} from "@ethersproject/abi";

export type {Fragment, JsonFragment}

export function bnToString(obj: object) {
    let res = {}
    if (Array.isArray(obj) && obj.length == 0) return []
    for (let key in obj) {
        // if (key == 'tokenIds') {
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
                    // @ts-ignore
                    items.push(bnToString(item))
                    //item._isBigNumber ? item.toString() :
                }

            }
            res = items
        }
        // @ts-ignore
        if (Number(key) < obj.length) continue
        if (typeof (obj[key]) == "object") {
            if (obj[key]._isBigNumber) {
                //
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

export class Web3ABICoder extends Interface {
    public abiCode: AbiCoder

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

    // const seaEvent = seaportCoder.getEvent(seaportlog.topics[0])

    decodeLog(log: { topics: string[], data: string }) {
        if (log.topics.length < 2) throw new Error("Topics data is incorrect: " + log.topics)
        const topicId = log.topics[0]
        const event = this.getEvent(topicId)
        if (!event) throw new Error("The ABI has no matching function:" + topicId)

        if (log.data == "0x") {
            event.inputs.forEach((val, index) => {
                if (!val.indexed) {
                    log.data = log.topics[index + 1]
                }
            })
        }
        const decodeData = this.decodeEventLog(event, log.data, log.topics)
        const values = bnToString(decodeData)
        return {name: event.name, type: event.type, values}
    }

    encodeInput(nameOrSighash: string, inputs: any[]): string {
        return this.encodeFunctionData(nameOrSighash, inputs)
    }

    decodeInput(inputData: string) {
        if (inputData.length < 10) throw new Error("Input data is incorrect: " + inputData)
        const sighash = inputData.substring(0, 10)
        const func = this.getFunction(sighash)
        if (!func) throw new Error("The ABI has no matching function:" + sighash)
        const decodeData = this.decodeFunctionData(func.name, inputData)
        const values = bnToString(decodeData);
        return {name: func.name, type: func.type, values}
    }

    decodeOutput(nameOrSighash: string, outputData: string) {
        const func = this.getFunction(nameOrSighash)
        if (!func) throw new Error("The ABI has no matching function:")
        const decodeData = this.decodeFunctionResult(func.name, outputData)
        const values = bnToString(decodeData)
        return {name: func.name, type: func.type, values}
    }

    decodeReceipt(receipt) {
        const evetns = this.getEvents()
        const validLogs = receipt.logs.filter(log => {
            if (log.topics.length > 0) {
                const topic = log.topics[0]
                return evetns.find(val => val.topic == topic) ? true : false
            } else {
                return false
            }
        })

        return validLogs.map(log => {
            const topic = log.topics[0]
            const coderFunc = this.getEvents().find(val => val.topic == topic)
            if (coderFunc) {
                return {...this.decodeLog(log), hash: log.transactionHash}
            }
        })
    }

    decodeBlock(block) {
        const funcIds = this.getFunctionSelectors()
        const validInputs = block.transactions.filter(tx => {
            if (tx.input.length > 10) {
                const methodId = tx.input.substring(0, 10)
                return funcIds.find(val => val.sighash == methodId) ? true : false
            } else {
                return false
            }
        })
        return validInputs.map(tx => {
            const methodId = tx.input.substring(0, 10)
            const coderFunc = this.getFunctionSelectors().find(val => val.sighash == methodId)
            if (coderFunc) {
                return {...this.decodeInput(tx.input), hash: tx.hash}
            }
        })
    }

}

