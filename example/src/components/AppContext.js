import React, {createContext, useEffect, useState} from "react";
import {message, Modal, Spin} from "antd";
import {Web3Wallets} from 'web3-wallets';
import {IndexedDB} from "../utils/indexedDB";

export const Context = createContext({});
export const AppContext = ({children}) => {
    const [wallet, setWallet] = useState({})
    const [account, setAccount] = useState({})
    const [indexDb, setIndexDb] = useState()

    useEffect(() => {
        async function fetchData() {
            const metamask = new Web3Wallets({name: "metamask"})//detectWallets()
            console.log("AppContext: wallet init")

            if (!metamask) {
                throw new Error("Wallet not exist")
            }
            const data = await metamask.connect()
            setWallet(metamask)
            if (data) {
                const balance = await metamask.walletSigner.getBalance()
                setAccount({balance, address: data[0]})
            }

            const indexDb = new IndexedDB()
            await indexDb.create_database()
            setIndexDb(indexDb)
        }

        fetchData().catch(err => {
            // console.log("AppContext FetchData error", err)
            message.error('Get account info fail，Please refresh the page.');
            throw err
        });
    }, []);
    return (
        <Context.Provider value={{wallet, account,indexDb}}>
            {children}
        </Context.Provider>
    )
}
