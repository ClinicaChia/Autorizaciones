
import { MongoClient } from "mongodb";

export default async function handler(req, res) {

    
    const { documento,tipo } = req.query;


    const client = await MongoClient.connect(process.env.MONGO_URI);

    const db = client.db("Autorizaciones");

    const collection = db.collection("Pacientes");


    const data = await collection.findOne({ documento: documento, Tipo: tipo });

    await client.close();


    data?  res.status(200).json(data) : res.status(404).json({message:"No se encontro el paciente"})

  }