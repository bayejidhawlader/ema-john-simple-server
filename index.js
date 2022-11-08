// 01 basic setup
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// 05
// DB_USER=emaJohnDbUser
// DB_PSAAWORD=PtREUsp6GjvMg2bv

// 02 Middleware
app.use(cors());
app.use(express.json());

// 06 Database Connect > Connect your Application
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSAAWORD}@cluster0.athiem3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// 07 connect mongo db products data to project
async function run() {
  try {
    const productCollection = client.db("emaJohn").collection("products");

    // Show data to http://localhost:5000/products from mongo db
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => ObjectId(id));
      console.log(ids);
      const query = { _id: { $in: objectIds } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

// 03 http://localhost:5000/  // server side access
app.get("/", (req, res) => {
  res.send("ema john server is running");
});

// 04 ema john running on : 5000 port on commend line
app.listen(port, () => {
  console.log(`ema john running on : ${port}`);
});
