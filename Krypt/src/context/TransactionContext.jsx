import React, {useState,useEffect} from "react";
import {ethers} from "ethers";
import { contractABI,contractAddress } from "../utils/constants";
export const TransactionContext = React.createContext();
const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer);
    return transactionContract;
    console.log(provider,signer,transactionContract);
}

export const TransactionProvider = ({children}) => {

    const [currentAccount,setCurrentAccount] = useState('');
    const [formData,setFormData] = useState({addressTo: '',amount:'',keyword:'',message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount,setTransactionCount] = useState(localStorage.getItem('transactionCount'))

    const handleChange = (e,name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]:e.target.value
        }))
    }

    const connectWallet = async() => {
        try{
            if(!ethereum) return alert("please install metamask");
            const accounts = await ethereum.request({method:'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        }catch(e){
            console.log(e);
            throw new Error("no ethereum object");
        }

    }

    const checkIfWalletIsConnected = async() =>{
        try {
            if(!ethereum) return alert("please install metamask");
            const accounts = await ethereum.request({method:'eth_accounts'});
            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }else{
                console.log("no account found");
            }
        } catch (error) {
            console.log(error);
        }
       
    }

    const sendTransaction = async() => {
        try{
            if(!ethereum) return alert("please install metamask");
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method:"eth_sendTransaction",
                params:[{
                    from:currentAccount,
                    to:addressTo,
                    gas:'0x5205',
                    value:parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
            setIsLoading(true);
            await transactionHash.wait();
            setIsLoading(false);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
        }catch(e){
            console.log(e);
            throw new Error("no ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    },[]);

    return(
        <TransactionContext.Provider value={{connectWallet,currentAccount,formData,setFormData,handleChange,sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}