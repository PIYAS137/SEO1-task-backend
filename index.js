const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5022;
require('dotenv').config()



// ================================ Middlewares ==================================//
app.use(express.json());
app.use(cors());
// ================================ Middlewares ==================================//



// ================================ MongoDB ======================================//

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frg7rqf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const taskCollection = client.db("taskDatabase").collection("taskCollection");


        // ------------- Create New Task API -------------->>>>>>
        app.post('/task', async (req, res) => {
            const data = req.body;
            const result = await taskCollection.insertOne(data);
            res.send(result);
        })

        // ------------- Get All Task API -------------->>>>>>
        app.get('/task', async (req, res) => {
            const result = await taskCollection.find({}).toArray();
            res.send(result);
        })

        // ------------- Update Task Status API -------------->>>>>>
        app.patch('/task/:sid', async (req, res) => {
            const status = req.body.status;
            const id = req.params.sid;
            const query = { _id: new ObjectId(id) };
            const upatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await taskCollection.updateOne(query, upatedDoc);
            res.send(result)
        })

        // ------------- Delete Task Status API -------------->>>>>>
        app.delete('/task/:sid',async(req,res)=>{
            const id = req.params.sid;
            const query = {_id : new ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })
        
        // ------------- Files Post API -------------->>>>>> 
        app.post('/files/:sid',async(req,res)=>{
            const id = req.params.sid;
            const data = req.body;
            const query = {_id : new ObjectId(id)};
            const operation = {
                $push : {
                    files : data
                }
            }
            const result = await taskCollection.updateOne(query,operation);
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// ================================ MongoDB ======================================//






app.get('/', async (req, res) => {
    res.send("Server is running....!!!");
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})