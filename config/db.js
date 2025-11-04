const mongoose=require ('mongoose');
function connectToDB(){
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in .env file');
        return;
    }
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("✅ Connected to MongoDB");
    }).catch((err)=>{
        console.error('❌ Error connecting to MongoDB:', err.message);
        console.error('⚠️  Server will continue running, but database operations will fail.');
        console.error('💡 Make sure your IP is whitelisted in MongoDB Atlas Network Access settings.');
    })
}

module.exports=connectToDB;