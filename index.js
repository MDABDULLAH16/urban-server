//  6Igzxy5VIHxWd3ZL urbanDB

import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://urbancart:LnQmCqH3mY3YCY6r@cluster0urb.hnpwx0k.mongodb.net/?appName=Cluster0urb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const urbanDB = client.db("urbanDB");
const productRequest = urbanDB.collection("productRequest");
const products = urbanDB.collection("products");
const reviewsCollection = urbanDB.collection('reviews');
const categoryCollection = urbanDB.collection('category');
const userCollection = urbanDB.collection('users');
const cartCollection= urbanDB.collection('carts')
app.get("/", (req, res) => {
  res.send("Urban is Running!!");
});
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Invalid token" });
    }

    req.decoded = decoded;
    next();
  });
};
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;

  const adminUser = await userCollection.findOne({ email });

  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).send({ error: "Forbidden: Admin only" });
  }

  next();
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    
    //users apis;
    app.post('/users', async (req, res) => {
      const user = req.body;
      
      const existingUser = await userCollection.findOne(user.email);
      if (existingUser) {
        return res.send({message:'user already exist!'})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get('/logged-user', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = await userCollection.findOne(query);
      res.send(cursor)
    })
    app.get('/users', async (req, res) => {
      // const query = {};
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
   app.patch("/users/toggleRole", async (req, res) => {
     try {
       const email = req.query.email;

       if (!email) {
         return res.status(400).send({ error: "Email is required" });
       }

       // Find user by email
       const user = await userCollection.findOne({ email });

       if (!user) {
         return res.status(404).send({ message: "User not found" });
       }

       // Toggle role 
       const newRole = user.role === "admin" ? "user" : "admin";

       const updateDoc = {
         $set: { role: newRole },
       };

       const result = await userCollection.updateOne({ email }, updateDoc);

       res.send({
         message: `Role updated to ${newRole}`,
         newRole,
         modifiedCount: result.modifiedCount,
       });
     } catch (error) {
       res.status(500).send({ error: error.message });
     }
   });


    //products apis
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const query = {}
      if (email){
        query.email = email;
      }
      
      const cursor = products.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.deleteOne(query);
      res.send(result);
    });
     app.post("/products", async (req, res) => {
       const newProduct = req.body;
       const result = await products.insertOne(newProduct);
       res.send(result);
     });
     app.get('/products/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    }) 
    //category apis;
    app.get("/categories", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
  
    app.get('/categories/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    })
   
    app.post("/categories", async (req, res) => {
      const newCategory = req.body;
      const result = await categoryCollection.insertOne(newCategory);
      res.send(result);
    });

    //products request apis;
    app.post("/productRequest", async (req, res) => {
      const newProduct = req.body;
      const result = await productRequest.insertOne(newProduct);
      res.send(result);
    });
    app.get("/productRequest", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = productRequest.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/productRequest/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await productRequest.deleteOne(query);
      res.send(result);
    });
    //reviews apis;
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log("urban is running");
});
