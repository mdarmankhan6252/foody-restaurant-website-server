const express = require('express');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {

      const foodsCollection = client.db("foodyDB").collection('foods');
      const usersCollection = client.db("foodyDB").collection('users');
      const cartsCollection = client.db("foodyDB").collection('carts');

      // json web token related api.

      

      //middlewares 

      

      // users related api

      app.get('/users', async (req, res) => {
         const result = await usersCollection.find().toArray();
         res.send(result)
      })

      app.get('/user/:email', async (req, res) => {
         const email = req.params.email;
         const query = { email };
         const result = await usersCollection.findOne(query);
         res.send(result)
      })

      app.post('/user', async (req, res) => {
         const user = req.body;
         const email = req.query.email;
         const query = { email: email }
         const existingUser = await usersCollection.findOne(query);
         if (existingUser) {
            return
         }
         const result = await usersCollection.insertOne(user);
         res.send(result)
      })

      app.delete('/user/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await usersCollection.deleteOne(query)
         res.send(result)
      })

      app.patch('/user/:id', async (req, res) => {
         const id = req.params.id;
         const role = req.body.role;
         const query = { _id: new ObjectId(id) }
         const updatedDoc = {
            $set: {
               role
            }
         }
         const result = await usersCollection.updateOne(query, updatedDoc)
         res.send(result)
      })


      // foods related api

      app.get('/foods', async (req, res) => {
         const search = req.query.search || '';
         let query = {
            name: { $regex: search, $options: 'i' }
         };
         const result = await foodsCollection.find(query).toArray();
         res.send(result)
      })

      app.get('/food/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await foodsCollection.findOne();
         res.send(result)
      })

      app.post('/food', async (req, res) => {
         const food = req.body;
         const result = await foodsCollection.insertOne(food);
         res.send(result)
      })

      app.delete('/food/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await foodsCollection.deleteOne(query)
         res.send(result)
      })

      // cart related api

      app.get('/cart', async (req, res) => {
         const email = req.query.email;
         const query = { "author.email": email }
         const result = await cartsCollection.find(query).toArray();
         res.send(result)
      })

      app.post('/cart', async (req, res) => {
         const item = req.body;
         const result = await cartsCollection.insertOne(item);
         res.send(result)
      })

      app.delete('/cart/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await cartsCollection.deleteOne(query);
         res.send(result)
      })


      await client.db("admin").command({ ping: 1 });
      console.log("You successfully connected to MongoDB!");
   } finally {
      //
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('My server is running..')
})

app.listen(port, () => {
   console.log("My server is running on port : ", port);
})