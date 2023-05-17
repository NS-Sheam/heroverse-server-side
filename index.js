const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());





app.get("/", (req, res) =>{
    res.send("toy marketplace is running");
})



app.listen(port, () =>{
    console.log(`toy marketplace is running on port ${port}`);
})