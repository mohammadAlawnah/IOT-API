import mongoose from "mongoose";

const connectDB = async()=>{
    mongoose.connect("mongodb+srv://hamod:moohamad@cluster0.q29afry.mongodb.net/")
    .then(()=>{
        console.log('connectDB')
    }).catch((err)=>{
        console.log(`error to connect DB ${err}`)
    })
}

export default connectDB;