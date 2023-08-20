require('dotenv').config();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'})

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL);
    const connection=mongoose.connection;

    connection.once('open',()=>{
        console.log('Database connected.');
    })
    
}
module.exports=connectDB;
