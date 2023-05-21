const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// toyMarketplace
// XykmVO6tDxovV0ma




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k0vsmln.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db("toyMarketplaceDb").collection("toyData");


    app.get("/alldata", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
        const result = await toyCollection.find(query).toArray();
        res.send(result);
        return;
      }
      if (req.query?.filter === "Price") {
        const result = await toyCollection.find().sort({ price: 1 }).toArray();
        res.send(result);
        return;
      }
      if (req.query?.filter === "Recent post") {
        const result = await toyCollection.find().sort({ createdAt: -1 }).toArray();
        res.send(result);
        return;
      }
      if (req.query?.search) {
        const searchQuery = req.query.search;
        const regex = new RegExp(searchQuery, 'i');
        const query = { toyName: regex };
        const result = await toyCollection.find(query).toArray();
        res.send(result);
        return;
      }
      const result = await toyCollection.find().toArray();
      res.send(result);
    })
    app.get("/alldata/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    })

    // Add product 
    app.post("/addtoy", async (req, res) => {
      const addedToy = req.body;
      addedToy.createdAt = new Date();
      const result = await toyCollection.insertOne(addedToy);
      res.send(result);

    })

    // Update toy
    app.put("/updatetoy/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      // console.log(body);
      const filter = { _id: new ObjectId(id) };
      const UpdatedToy = {
          $set: {
              ...body
          },
      };
      const result = await toyCollection.updateOne(filter, UpdatedToy);
      // console.log(result);
      res.send(result);
  });

  // Delete Toy 
  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await toyCollection.deleteOne(query);
    res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("toy marketplace is running");
})



app.listen(port, () => {
  console.log(`toy marketplace is running on port ${port}`);
})