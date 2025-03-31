const express = require('express');
const cors = require("cors")

const app = express();

// Asegúrate de usar el middleware express-fileupload antes de las rutas
app.use(express.static('public'));
app.use(cors())
app.set('view engine', 'pug')

app.get("/template1", (req, res) => {
    res.render('t1.pug', {title: "pug1", message:"HOLA BUENAS TARDES"})
})

app.listen(3000, () => {
    console.log("listening on port 3000");
  });