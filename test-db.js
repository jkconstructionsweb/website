const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://jkconstructionsweb_db_user:LAvIqa3ElCc0rHRf@jkwebsite.lxhex0x.mongodb.net/jkwebsite?retryWrites=true&w=majority";

async function test() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected!");
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check Pages
    const pages = await mongoose.connection.db.collection('pages').find({}).toArray();
    console.log(`Found ${pages.length} pages.`);
    if (pages.length > 0) {
      console.log("First page name:", pages[0].pageName);
    }

    mongoose.disconnect();
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
