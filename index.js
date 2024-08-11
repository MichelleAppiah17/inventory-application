const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:5000", // Adjust based on your front-end's address
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typingResponse", data);
  });

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
  });
});

// MongoDB configuration
const uri =
  "mongodb+srv://inventory-app:dV386sOsdzOj76A5@cluster0.jdkra.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const bookCollection = client
      .db("BookInventory")
      .collection("books");

    // Upload a book
    app.post("/upload-book", async (req, res) => {
      try {
        const data = req.body;
        const result = await bookCollection.insertOne(data);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to upload book", error });
      }
    });

    // Get all books
    app.get("/all-books", async (req, res) => {
      try {
        const books = await bookCollection.find().toArray();
        res.send(books);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch books", error });
      }
    });

    // Update a book
    app.patch("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id: new ObjectId(id) };

        const updateDoc = {
          $set: {
            ...updateBookData,
          },
        };

        const options = { upsert: true };
        const result = await bookCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to update book", error });
      }
    });

    // Delete a book
    app.delete("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await bookCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to delete book", error });
      }
    });

    // Get books by category
    app.get("/books", async (req, res) => {
      try {
        let query = {};
        if (req.query?.category) {
          query = { category: req.query.category };
        }
        const result = await bookCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({
            message: "Failed to fetch books by category",
            error,
          });
      }
    });

    // Get a specific book by ID
    app.get("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await bookCollection.findOne(filter);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch book", error });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
