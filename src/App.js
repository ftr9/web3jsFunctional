import React, { useState, useEffect } from 'react'
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const Apps = () => {

    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [storageValue, setStorageValue] = useState(0);
    const [web3, setWeb3] = useState(null);
    const [accountBalance, setAccountBalance] = useState(null);

    useEffect(() => {

        (async () => {
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();

                // Use web3 to get the user's accounts.
                const accounts = await web3.eth.getAccounts();

                // Get the contract instance.
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = SimpleStorageContract.networks[networkId];
                const instance = new web3.eth.Contract(
                    SimpleStorageContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                const weiBalance = await web3.eth.getBalance(accounts[0]);
                const accountBalance = web3.utils.fromWei(weiBalance);
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                setWeb3(web3);
                setAccounts(accounts);
                setContract(instance);
                setAccountBalance(accountBalance);
                //call this method
            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        })();

    }, []);

    const runExample = async () => {
        //Stores a given value, 5 by default.
        await contract.methods.set(20).send({ from: accounts[0] });

        //Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();

        //Update state with the result.
        setStorageValue(response);

    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
            <h1>Good To go !</h1>
            <button onClick={runExample} >Set value</button>
            <p>Your Truffle Box is installed and ready.</p>
            <h2>Smart Contract Example</h2>
            <p>
                If your contracts compiled and migrated successfully, below will show
                a stored value of 5 (by default).
            </p>
            <p>
                Try changing the value stored on <strong>line 42</strong> of App.js.
            </p>
            <div>The stored value is: {storageValue}</div>
            <div>your have {accountBalance} left in your wallet</div>
        </div>
    );
}

export default Apps