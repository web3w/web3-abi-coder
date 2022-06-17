import {AbiCoder, Fragment, Interface, JsonFragmentType, JsonFragment} from "@ethersproject/abi";

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
                if(item._isBigNumber){
                    // @ts-ignore
                    items.push(item.toString())
                }else {
                    // @ts-ignore
                    items.push(bnToString( item))
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

    constructor(abis: ReadonlyArray<Fragment | JsonFragment>) {
        super(abis);
        this.abiCode = this._abiCoder
    }

    getFunctionName(sighash: string):string {
        const funcAbi = this.getFunction(sighash)
        return funcAbi.name
    }

    getFunctionSelector(name: string):string {
        return this.getSighash(name)
    }

    getFunctionSelectors():{name:string,sighash:string}[] {
        const funcAbis = this.fragments.filter(val => val.type === 'function')
        return funcAbis.map(val => ({
            name: val.name,
            sighash: this.getSighash(val.name)
        }))
    }

    getFunctionSignature(nameOrSighash: string, type?: "minimal" | "json" | "full"): string {
        const funcAbi = this.getFunction(nameOrSighash)
        return funcAbi.format(type)
    }

    decodeLog(log: { topics: string[], data: string }) {
        if (log.topics.length < 2) throw new Error("Topics data is incorrect: " + log.topics)
        const event = this.getEvent(log.topics[0])
        if (!event) throw new Error("The ABI has no matching function:" + log.topics[0])
        const decodeData = this.decodeEventLog(event.name, log.data, log.topics)
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


}

