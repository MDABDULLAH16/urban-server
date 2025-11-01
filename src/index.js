//  6Igzxy5VIHxWd3ZL urbanDB

import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://urbanDB:6Igzxy5VIHxWd3ZL@basic-project.hymtgk.mongodb.net/?appName=basic-project";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const urbanDB = client.db("urbanDB");
const productRequest = urbanDB.collection("productRequest");
const products = urbanDB.collection("products");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    app.get("/products", async (req, res) => {
      const cursor = products.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      res.send(result);
    });
    app.post("/productRequest", async (req, res) => {
      const newProduct = req.body;
      const result = await productRequest.insertOne(newProduct);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log("urban is running");
});
