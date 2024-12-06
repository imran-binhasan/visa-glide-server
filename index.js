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

    const database = client.db('visa-glide-db');
    const userlist = database.collection('userlist')
    const visalist = database.collection('visalist')
    app.get('/', async(req,res)=>{
        res.send('Server is running ....')
    })

    app.get('/users',async(req, res)=> {
      const result = await userlist.find().toArray();
      res.send(result)
    })

    app.get('/visas', async(req, res)=> {
      const result = await visalist.find().toArray();
      res.send(result)
    })

    app.post('/users',async(req, res)=> {
      const query = req.body;
      const result = await userlist.insertOne(query)
      res.send(result)
      console.log(result)
    })

    app.post('/visas',async(req, res)=> {
      const query = req.body;
      const result = await visalist.insertOne(query);
      res.send(result)
      console.log(result)
    
    })





  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Listening on port : ${port}`)
})