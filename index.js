const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const visaApplications = database.collection('visa-applications')
    app.get('/', async(req,res)=>{
        res.send('Server is running ....')
    })

    app.get('/users',async(req, res)=> {
      const result = await userlist.find().toArray();
      res.send(result);
    })

    app.get('/visas', async(req, res)=> {
      const result = await visalist.find().toArray();
      res.send(result)
    })

    app.get('/visas/:num', async(req, res)=> {
      const max = parseInt(req.params.num);
      console.log(max)
      const result = await visalist.find().sort({ _id: -1 }).limit(max).toArray()
      res.send(result)
      console.log(result)
    })

    app.get('/visa/:id',async (req, res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await visalist.findOne(query);
      res.send(result);
    })


    app.get('/applications',async (req,res)=>{
      const result = await visaApplications.find().toArray();
      res.send(result)
    })


    app.get('/applications/:uid', async(req,res)=>{
      const uid = req.params;
      const result = await visaApplications.find(uid).toArray();
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
      console.log(query)
      console.log(result)
    
    })

    app.post('/applications',async(req,res)=>{
      const query = req.body;
      console.log(query)
      const result = await visaApplications.insertOne(query);
      res.send(result);
      console.log(result)
    })

    app.put('/visa/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);  // Check that data includes applicationMethods
    
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          countryName: data.countryName,
          countryImage: data.countryImage,
          visaType: data.visaType,
          processingTime: data.processingTime,
          fee: data.fee,
          validity: data.validity,
          applicationMethods: data.applicationMethods, // Correct field name
        },
      };
    
      const result = await visalist.updateOne(filter, updateData, options);
      res.send(result);
    });
    

    app.delete('/visa/:id',async (req,res)=> {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await visalist.deleteOne(query);
      res.send(result);
      console.log(result)
    })

    app.delete('/application/:id',async (req,res)=> {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await visaApplications.deleteOne(query);
      res.send(result);
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