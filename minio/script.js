const express = require('express');
const fileUpload = require('express-fileupload');
const Minio = require('minio');
const cors = require("cors")


const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9009,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
  useSSL: false,
});

const app = express();

// Asegúrate de usar el middleware express-fileupload antes de las rutas
app.use(fileUpload());  // Maneja la carga de archivos
app.use(express.static('public'));
app.use(cors())

app.post("/ficheros/createBucket", async (req, res) => {
  try {
    await minioClient.makeBucket(req.body.nombre, 'us-east-1');
    res.send({ res: "00", description: "OK", data: { bucket: req.body.nombre } });
  } catch (error) {
    res.status(500).send({ error: error, res: "500", description: "ERR", data: { bucket: req.body.nombre } });
  }
});

app.post("/ficheros/addToBucket", async (req, res) => {
    const bucket = req.body.bucket;
    const file = req.files.file;  // `file` es el nombre del campo en tu formulario
  try {
    await minioClient.putObject(bucket, file.name, file.data,file.size);  // Usa file.data para obtener el contenido del archivo
    res.status(200).send({ description: "OK", data: { bucket: bucket } });
  } catch (error) {
    res.status(500).send({ error: error, res: "500", description: "ERR", data: { bucket: req.body.bucket } });
  }
});

app.get("/ficheros/:bucket/:fichero", async (req, res) => {
    const bucket = req.params.bucket
    const fichero = req.params.fichero
    try {
        const dataStream = await minioClient.getObject(bucket, fichero)
        dataStream.pipe(res)
    } catch (error) {
        res.status(500).send({description: "ERROR", msg: error})
    }
})

app.delete("/ficheros/:bucket/:fichero", async (req, res) => {
    const bucket = req.params.bucket
    const fichero = req.params.fichero
    try {
        await minioClient.removeObject(bucket, fichero)
        res.status(200).send({msg: "object removed"})
    } catch (error) {
        res.status(500).send({description: "ERROR", msg: error})
    }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
