const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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