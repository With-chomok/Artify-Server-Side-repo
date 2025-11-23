const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://artify-db:BbSLdW5YgYrjHdwM@dipol-database-cluster.fbp5e4u.mongodb.net/?appName=DIPOL-DATABASE-CLUSTER";

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
    const db = client.db("artworksCollection");
    artworksCollection = db.collection("artworks");
    favoritesCollection = db.collection("favorites");

    console.log(" MongoDB connected successfully!");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
}

run();
app.get("/", (req, res) => {
  res.send("Server is running fine!");
});







app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});