import { MongoClient } from "mongodb";


export default async function handler(req, res) {

    const { documento,EPS,Nombre,existe,Tipo} = req.body;
    const client = await MongoClient.connect(process.env.MONGO_URI);

    const db = client.db("Autorizaciones");

    const collection = db.collection("Pacientes");

   if( existe ){
    await collection.updateOne({documento:documento},{$set:{EPS:EPS}})
   }

   else{
    await collection.insertOne({documento:documento,Nombre:Nombre,EPS:EPS,Tipo})
   }
    


    res.status(200).json("OK")
  }
  