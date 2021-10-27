const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yoxzf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("carRepari");
      const serviceCollection = database.collection("services");

      // GET API 
      app.get('/services', async(req, res) =>{
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);

      });
      // GET SINGLE SERVICE
      app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('getting specific ID', id);
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.json(service)
      })
      
    //POST API
    app.post('/services', async(req, res)=>{
      const service = req.body;
      console.log('Hit the post api', service);
      // create a document to insert
      
      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json('Post hitted')
    });

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   // client.close();
// });
app.get('/hello', (req, res) =>{
  res.send('node server in updated')
})
app.get('/', (req, res) =>{
    res.send('USER in Running');
  });

  app.listen(port, () =>{
      console.log('Running Master Server', port);
  })