import React, {createContext, useEffect, useState} from "react";
import {message, Modal, Spin} from "antd";
import {detectWallets} from "web3-wallets";

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
    debugger
    const {metamask} = detectWallets()
    const [trc20s, setTrc20s] = useState()
    const [scanUrl, setScanUrl] = useState()

    useEffect(() => {
        async function fetchData() {
            console.log("AppContext: wallet init")
            // tronWeb = window.ethereum
            if (!metamask) {
                installWallet()
                throw new Error("Tron web not exist")
            }
            const data = await metamask.enable()

            if (data) {
                const address = data[0]
                //https://cn.developers.tron.network/reference/getaccount
                // const account = await tronWeb.trx.getAccount(address).catch(err => {
                //     message.error('GetAccount fail，Please refresh the page.');
                // })
                // account.address = address
                // const scanUrl = chainScanInfo[nodeHost]
                // setScanUrl(scanUrl)
                // const trc20s = chainTrc20s[network]
                // setTrc20s(trc20s)
            } else {

            }
        }

        fetchData().catch(err => {
            // console.log("AppContext FetchData error", err)
            message.error('Get account info fail，Please refresh the page.');
            throw err
        });
    }, []);
    return (
        <Context.Provider value={{wallet: metamask}}>
            {children}
        </Context.Provider>
    )
}
