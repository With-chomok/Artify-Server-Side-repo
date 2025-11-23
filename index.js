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


// Routes

app.get("/", (req, res) => {
  res.send("Server is running fine!");
});


app.get("/artworks", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const artworks = await artworksCollection
      .find({ visibility: "Public" })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.send(artworks);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch artworks" });
  }
});

app.get("/artworks-explore", async (req, res) => {
  const result = await artworksCollection
    .find({ visibility: "Public" })
    .toArray();
  res.send(result);
});

app.post("/artworks", async (req, res) => {
  try {
    const data = req.body;
    const result = await artworksCollection.insertOne(data);
    res.send({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add artwork" });
  }
});

//  Get single artwork by ID
app.get("/artworks/:id", async (req, res) => {
  const id = req.params.id;
  const result = await artworksCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});
//  Like Artwork
app.patch("/artworks/like/:id", async (req, res) => {
  const id = req.params.id;
  const result = await artworksCollection.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { likes: 1 } }
  );
  res.send(result);
});

//  Add to Favorites
app.post("/favorites", async (req, res) => {
  const favorite = req.body;
  const exists = await favoritesCollection.findOne({
    userEmail: favorite.userEmail,
    artworkId: favorite.artworkId,
  });
  if (exists) {
    return res.status(409).send({ message: "Already added" });
  }
  const result = await favoritesCollection.insertOne(favorite);
  res.send(result);
});



app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});