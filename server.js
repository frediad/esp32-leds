const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

app.use(express.json());

// 🔑 TU URI
const uri = "mongodb+srv://fadame:TU_PASSWORD@cluster0.qirxnhe.mongodb.net/esp32";

const client = new MongoClient(uri);

// 🔥 RUTA PARA GUARDAR
app.post("/leds", async (req, res) => {
  try {
    await client.connect();
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

    res.json({ message: "OK" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 RUTA PARA VER DATOS
app.get("/leds", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("esp32");

    const data = await db.collection("leds")
      .find()
      .sort({ fecha: -1 })
      .limit(50)
      .toArray();

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 PUERTO (IMPORTANTE PARA RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});