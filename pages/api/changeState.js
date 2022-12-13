import { MongoClient } from "mongodb";

export default async  function handler(req, res) {
    const data = req.body;
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db("Autorizaciones");
    const collection = db.collection("Historial");

    await collection.updateOne( { TimeStap: data.TimeStap}, { $set: { "Estado": data.Estado} } );
    await client.close();
    res.status(200).json( "OK" )
  }
  