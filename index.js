const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors({ origin: 'https://inventory-application-zrr6.onrender.com/' }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB configuration

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://inventory-app:dV386sOsdzOj76A5@cluster0.jdkra.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }});

async function run() {
  try {
    await client.connect();

    const bookCollection = client.db('BookInventory').collection('books');

    app.post('/upload-book', async (req, res) => {
      const data = req.body;
      const result = await bookCollection.insertOne(data);
      res.send(result);
    });

    app.get('/all-books', async (req, res) => {
      const books = await bookCollection.find().toArray();
      res.send(books);
    });

    app.patch('/book/:id', async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          ...updateBookData,
        },
      };

      const options = { upsert: true };
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    });

    app.get('/books', async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(filter);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

