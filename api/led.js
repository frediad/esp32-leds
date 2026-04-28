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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("esp32");

    const { led, estado } = req.body;

    if (!led || !estado) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    await db.collection("leds").insertOne({
      led,
      estado,
      fecha: new Date()
    });

    res.status(200).json({ message: "OK" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}