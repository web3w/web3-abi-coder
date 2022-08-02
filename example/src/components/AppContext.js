import React, {createContext, useEffect, useState} from "react";
import {message, Modal, Spin} from "antd";
// import {detectWallets} from "web3-wallets";
import {Web3Wallets} from 'web3-wallets';

const installWallet = () => {
    Modal.info({
        title: 'Install MetaMask Wallet',
        content: (
            <div>
                <p>Please install the MetaMask wallet</p>
                <a href={'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'}
                   target={"_blank"}>Metamask</a>
            </div>
        ),
        onOk(close) {
            const ethereum = window.ethereum
            if (ethereum) {
                close()
            }
        },
    });
};

const unlockWallet = () => {
    Modal.info({
        title: 'Unlock MetaMask Wallet',
        content: (
            <div>
                <p>Please <strong>Unlock</strong> the MetaMask wallet</p>
            </div>
        ),
        onOk(close) {
            const ethereum = window.ethereum
            if (ethereum) {
                ethereum.enable()
                close()
            }
            window.open(window.location.href, "_self")
        },
    });
};

export const Context = createContext({});
export const AppContext = ({children}) => {
    const [wallet, setWallet] = useState({})
    const [account, setAccount] = useState({})

    useEffect(() => {
        async function fetchData() {
            // if(wallet.version) return
            const metamask = new Web3Wallets({name: "metamask"})//detectWallets()
            console.log("AppContext: wallet init")

            if (!metamask) {
                installWallet()
                throw new Error("Wallet not exist")
            }
            const data = await metamask.connect()
            setWallet(metamask)
            if (data) {
                const balance =await metamask.walletSigner.getBalance()
                setAccount({balance, address: data[0]})
            }
        }

        fetchData().catch(err => {
            // console.log("AppContext FetchData error", err)
            message.error('Get account info fail，Please refresh the page.');
            throw err
        });
    },[]);
    return (
        <Context.Provider value={{wallet, account}}>
            {children}
        </Context.Provider>
    )
}
