require('dotenv').config()

const web3Solana = require('@solana/web3.js');
let connection = new web3Solana.Connection(web3Solana.clusterApiUrl('devnet'), 'confirmed');
const sola = "7nB3H7Qo8qSCV2coPoHrFvDAK7gjiZkt9Wf8g8XKjABS"
let base58publicKey = new web3Solana.PublicKey(sola);
connection.getBalance(base58publicKey).then(saldo => {
    console.log({saldo})
}).catch(e => {
    console.log(e)
})

let {Web3} = require("web3")
// provider
let testnet = process.env.TESTNET
// public account
let walletAddress = process.env.MTMSK_ADDRS
// conexión
const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
// obtenemos el balance
web3.eth.getBalance(walletAddress).then(i => {
    // convertimos a ether
    const etherValue = Web3.utils.fromWei(i, 'ether');
    console.log(`${etherValue} ether`)
}).catch(e => {
    console.log(e)
})