const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxzfl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const packageCollection = client.db("travilydb").collection("allPackages");
    const bookingCollection = client.db("travilydb").collection("allBookings");



    // get api load all packages
    app.get("/packages", async (req, res) => {
        const result = await packageCollection.find({}).toArray();
        res.send(result);
    })
    // find single package
    app.get("/booking/:id", async (req, res) => {
        const id = req.params.id;
        const result = await packageCollection.findOne({ _id: ObjectId(id) });
        res.send(result);
    })

    // post  api book a package
    app.post("/bookPackage", async (req, res) => {
        const bookingPackage = req.body;
        const result = await bookingCollection.insertOne(bookingPackage);
        res.send(result);
    })

    // get all booking packages
    app.get("/allBookings", async (req, res) => {
        const result = await bookingCollection.find({}).toArray();
        res.send(result);
    })

    // post a new package
    app.post("/addPackage", async (req, res) => {
        const addPackage = req.body;
        const result = await packageCollection.insertOne(addPackage);
        res.send(result);
    })

    // get my booking packages
    app.get("/myPackages/:email", async (req, res) => {
        const email = req.params.email;
        const result = await bookingCollection.find({ email: (email) }).toArray();
        res.send(result);
    })

    // remove a single package
    app.delete("/myPackages/:id", async (req, res) => {
        const id = req.params.id;
        const result = await bookingCollection.deleteOne({ _id: ObjectId(id) });
        res.send(result);
    })

    // get a single package
    app.get("/allBookings/:id", async (req, res) => {
        const id = req.params.id;
        const result = await bookingCollection.findOne({ _id: ObjectId(id) });
        res.send(result);
    })

    // update packages status
    app.put("/allBookings/:id", async (req, res) => {
        const id = req.params.id;
        const update = req.body;
        const find = { _id: ObjectId(id) };
        const updateDoc = {
            $set: {
                status: update.status,
            },
        };
        const result = await bookingCollection.updateOne(
            find,
            updateDoc,
        );
        res.json(result);
    });
    // client.close();
});


app.get("/", (req, res) => {
    res.send("Getting successfully");
});

app.listen(port, () => {
    console.log("listening on port", port);
});