const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://jkconstructionsweb_db_user:LAvIqa3ElCc0rHRf@jkwebsite.lxhex0x.mongodb.net/jkwebsite?retryWrites=true&w=majority";

async function test() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");
    mongoose.disconnect();
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
