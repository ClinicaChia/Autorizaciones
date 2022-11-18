// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";


export default async function handler(req, res) {
  
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Historial");

  const time = new Date()

  const initTime = time.getTime() - 1000*60*60*24*7

  const result = await collection.find({ TimeStap: { "$gte": initTime } }).toArray();

  await client.close();
  res.status(200).json({ data: result })
}
