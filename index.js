const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dolir.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("userInformation").collection("user");

        // task create
        app.post('/user', async (req, res) => {
            const newTask = req.body;
            const result = await userCollection.insertOne(newTask);
            res.send(result);
        });

        // Get all task
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const allTask = await cursor.toArray();
            res.send(allTask);
        });

        // Get single task
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleTask = await userCollection.findOne(query);
            res.send(singleTask);
        });

        // Update task
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: data.name,
                    description: data.description
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // Delete single task
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Create task using rest api');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})