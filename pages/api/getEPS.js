import { MongoClient } from "mongodb";


export default async function handler(req, res) {

    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db("Autorizaciones");
    const collection = db.collection("EPS");
    const data = await collection.find({}).toArray();
    res.status(200).json(data)
  }