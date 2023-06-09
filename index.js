const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ad6o2n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const productCollection = client.db("toyHaven").collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // filter with email and descending and ascending on the price.
    app.get("/mytoys/:email", async (req, res) => {
      const { email } = req.params;
      try {
        const result = await productCollection.find({ email }).toArray();
        const sortedResult = result.sort((a, b) => a.price - b.price);
        res.send(sortedResult);
      } catch (error) {
        res.status(500).send();
      }
    });
// Add any toy
    app.post("/addtoy", async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });
    // update toy from my toys page
    app.patch("/updatetoy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: req.body.price,
          available_quantity: req.body.available_quantity,
          detail_description: req.body.detail_description,
        },
      };
      const result = await productCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    //  delete toy from my toys page
    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log(`running on port, ${port}`);
});
