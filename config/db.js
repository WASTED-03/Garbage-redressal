const mongoose=require ('mongoose');
function connectToDB(){
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in .env file');
        process.exit(1);
    }
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to db");
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    })
}

module.exports=connectToDB;