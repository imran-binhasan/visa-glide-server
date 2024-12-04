const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { configDotenv } = require('dotenv');
configDotenv()

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

const uri = process.env.CONNECTION_STRING


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/', async(req,res)=>{
        res.send('Server is running ...')
    })





  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Listening on port : ${port}`)
})