const mongoose = require("mongoose");
//const ObjectId = mongoose.schema.Types.ObjectId

const userschema = new mongoose.Schema({
   username:{
    type:String,
    required:true,
    trim:true,
   },

   password:{
    type:String,
    required:true,
    trim:true,
    minLen: 8, 
    maxLen: 15,
},

   email:{
    type:String,
    required:true,
    unique:true,
    trim:true,

   },

   role:{
    type:String,
    required:true,
    enum:["taxpayer","taxAccountant", "admin"]
   },

   panNumber :{
   type:String,
   required :true,
   trim:true,
   },

   city:{
    type:String,
    required:true,
    trim:true,
   },

   isDeleted:{
    type:Boolean,
    default:false,
   },
 }, {timestamps:true

});

module.exports=mongoose.model('users',userschema)

