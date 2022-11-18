// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from "mongodb";
import nc from "next-connect";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .get((req, res) => {
    res.send("Hello world");
  })
  .post(async (req, res) => {

    const data = req.body;

    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db("Autorizaciones");
    const collection = db.collection("Servicios");

    
    const query = data.servicio==="Facturador" ? { usuario: data.servicio,Cargo: data.rango,Password: data.pass , autorizador: data.usuario  } : { usuario: data.servicio,Cargo: data.rango,Password: data.pass };
 
    const result = await collection.findOne(query);
 
    await client.close();
    result ? res.status(200).json(result) : res.status(401).end("No se encontro el usuario");

   
    
  })



export default handler;