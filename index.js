import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const contractBalanceButton = document.getElementById("contractBalanceButton")
const accountBalanceButton = document.getElementById("accountBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
contractBalanceButton.onclick = contractBalance
accountBalanceButton.onclick = accountBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.error(error)
        }
        connectButton.innerHTML = "Already Connected!"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please download a wallet"
    }
}

// to send a txn what are the things we absolutely need?
// provider + connection to the BC + signer + wallet + someone with some gas
// contract that we are interacting with
// ABI + Address
// IMPORTANT !! => To interact with a contract we are gonna need 3 things: contractAddress + abi + signer

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the tx to be mined
            // listed for an event
            // hey, wait for this TX to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log(`${ethAmount} ETH is successfully sent!`)
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise
    // listen for this txn to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
    // Create a listener for the blockchain
}

async function contractBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contractBalance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(contractBalance))
    }
}

async function accountBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const accountAddress = await signer.getAddress()
        const accountBalance = await provider.getBalance(accountAddress)
        console.log(ethers.utils.formatEther(accountBalance))
    }
}

// withdraw

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log(`Money successfully withdrawn!`)
        } catch (error) {
            console.log(error)
        }
    }
}
