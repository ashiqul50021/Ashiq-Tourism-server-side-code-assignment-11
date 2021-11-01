const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.opuz8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('ashiqTourism');
        const destinationsCollection = database.collection('destinations');
        const ordersCollection = database.collection('orders');
        console.log('database connected successfully')

        // get api
        app.get('/destinations', async(req, res) =>{
            const cursor = destinationsCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        });

        // get orders api
        app.get('/orders', async(req, res) =>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // get single destination
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const destination = await destinationsCollection.findOne(query);
            res.json(destination);
        })

        // post api
        app.post('/destinations', async (req, res) => {
            const destination = req.body;
            console.log('hit the post api', destination);
          
            const result = await destinationsCollection.insertOne(destination);
            console.log(result);
            res.json(result)
        });
        // order post api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);
          
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });
        // DELETE API
        app.delete('/destinations/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await destinationsCollection.deleteOne(query);
            res.json(result);
        })

        // / Delete order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            // console.log(service);
            res.json(result)
        })

        // approve order
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const doc = {
                $set: {
                    status: 'Approved'
                }
            }
            const service = await ordersCollection.updateOne(query, doc);
            // console.log(service);
            res.send(service)
        })



        // single order api
        app.get('/orders/:Id', async (req, res) => {
            const userEmail = req.params.Id;
            console.log(userEmail);
            // console.log('hit the post');
            console.log(userEmail);
            const query = { email: userEmail };
            const orders = await ordersCollection.find(query).toArray();
            // console.log(user);
            res.json(orders)
        });

    }
    finally {
        //await client.close();
    }


}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ashiq tourism server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})