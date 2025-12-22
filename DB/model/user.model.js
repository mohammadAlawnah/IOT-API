import { Schema,model } from "mongoose";
const userSchema = new Schema({
    userName : {
        type:String,
        require:true,
        min : 4,
        max:20
    },
    email :{
        type : String,
        require : true,
        unique: true,
    },
    confirmEmail:{
        type : Boolean,
        default : true
    },
    password : {
        type : String,
        require : true,
    },
    image:{
        type : Object,
    },
    phone:{
        type : String,
    },
    address:{
        type : String,
    },
    gender : {
        type : String,
        enum : ["Male","Femail"],
        require : true
    },
    status : {
        type: String,
        default : 'Active',
        enum : ['Active','NotActive']
    },
    points: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
    },
    role : {
        type : String,
        default : 'User',
        enum : ['User','Admin','SuperAdmin']
    }
    
},{
    timestamps : true
})

const userModel = model('user',userSchema);
export default userModel;