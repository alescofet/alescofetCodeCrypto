let {Web3} = require("web3")
let express = require('express')
// esta url la obtenemos del Proyecto creado en infura
const PROVIDER = "https://holesky.infura.io/v3/fbfc0a81129646988592f06ea44924ae";
// inicializamos el provider
const web3 = new Web3(PROVIDER)
const app = express()
app.get("/balance/:address", async (req, res) => {
    console.log(req.params.address);
    const balance = await web3.eth.getBalance(req.params.address)
    res.json({"balance":balance.toString()})
    })
    app.listen(3000,()=>{
        console.log("listening on port 3000");
    })
    