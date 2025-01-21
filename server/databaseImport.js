const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("testDB");
    const collection = db.collection("testCollection");

    const data = JSON.parse(fs.readFileSync("oracle-cards-20250114100205.json", "utf-8"));
    const result = await collection.insertMany(data);

    console.log(`${result.insertedCount} documents inserted!`);
  } finally {
    await client.close();
  }
}

importData().catch(console.dir);