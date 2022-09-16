// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";


export default async function handler(req, res) {
  const data = req.body;
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Historial");
  console.log(data)
  await collection.updateOne( { TimeStap: data.TimeStap}, { $set: { autorizacion: data.autorizacion, AuthTime:data.AuthTime } } );

  await client.close();
  res.status(200).json("ok" )
}
