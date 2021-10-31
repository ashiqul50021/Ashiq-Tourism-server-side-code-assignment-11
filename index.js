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
        console.log('database connected successfully')

        // get api
        app.get('/destinations', async(req, res) =>{
            const cursor = destinationsCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
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
        // DELETE API
        app.delete('/destinations/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await destinationsCollection.deleteOne(query);
            res.json(result);
        })
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