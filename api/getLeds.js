import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {

  try {
    const client = await clientPromise;
    const db = client.db("esp32");

    const data = await db.collection("leds")
      .find()
      .sort({ fecha: -1 })
      .limit(50)
      .toArray();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}