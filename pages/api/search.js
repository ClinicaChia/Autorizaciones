
import { MongoClient } from "mongodb";

export default async function handler(req, res) {

    
    const { documento,tipo } = req.query;

    console.log({ documento: documento, Tipo: tipo });

    const client = await MongoClient.connect(process.env.MONGO_URI);

    const db = client.db("Autorizaciones");

    const collection = db.collection("Historial");


    const data = await collection.find({ documento, tipo }).toArray();

    await client.close();


    data?  res.status(200).json(data) : res.status(404).json({message:"No se encontro el paciente"})

  }