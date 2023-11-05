const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())

//dV386sOsdzOj76A5

app.get('/',(req,res) => {
    res.send('Hello World!')
})

//mongodb configuration

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://inventory-app:dV386sOsdzOj76A5@cluster0.jdkra.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    //create collection of documents
    const bookCollection = client.db("BookInventory").collection("books");

    //insert a book to the db: post method
    app.post("/upload-book", async(req,res) => {
        const data = req.body;
        const result = await bookCollection.insertOne(data);
        res.send(result);
    })

    //get all books 
    app.get("/all-books", async(req,res) => {
        const books = bookCollection.find();
        const result = await books.toArray();
        res.send(result);
    })

    //update a book
    app.patch("/book/:id", async(req,res) => {
        const id = res.params.id;
        const updateBookData = req.body;
        const filter = {_id: new ObjectId(id)};
        
        const updateDoc = {
            $set: {
                ...updateBookData
            }
        }
        const options = {upset: true};
        //update
        const result = await bookCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})