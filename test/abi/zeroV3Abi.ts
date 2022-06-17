import {JsonFragment} from "../../src/index";

export const ERC20_METHOD_ABI: JsonFragment = {
    constant: false,
    inputs: [
        {
            name: 'tokenContract',
            type: 'address'
        }
    ],
    name: 'ERC20Token',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
}
export const ERC721_METHOD_ABI: JsonFragment = {
    constant: false,
    inputs: [
        {
            name: 'tokenContract',
            type: 'address'
        },
        {
            name: 'tokenId',
            type: 'uint256'
        }
    ],
    name: 'ERC721Token',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
}
export const ERC1155_METHOD_ABI: JsonFragment = {
    constant: false,
    inputs: [
        {name: 'tokenAddress', type: 'address'},
        {name: 'tokenIds', type: 'uint256[]'},
        {name: 'tokenValues', type: 'uint256[]'},
        {name: 'callbackData', type: 'bytes'}
    ],
    name: 'ERC1155Assets',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
}
