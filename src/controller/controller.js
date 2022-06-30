const usermodel=require("../model/user.js")
//const ObjectId = mongoose.schema.Types.ObjectId

const bcrypt = require('bcrypt')
//const user = require("../model/user.js")
const jwt=require('jsonwebtoken')


const isValid = function(value){
    if(typeof (value) === 'undefined' || value === null) return false
    if(typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}


const createuser = async function (req,res){
    try{
    const data =req.body

    const {username, password ,email,role , panNumber,city}=data
    

    //  if(data==0){
    //      return res.status(400).send({status:false, msg:"data is missing please the data to create"})
    //  }
    
    if(Object.keys(data)==0){
        return res.status(400).send({status:false, msg:"data is missing please the data to create"})
     }
    if(!isValid(username) ){return res.status(400).send({status:false, msg:"username is missing please enter the data to create"})}
    
    if(!isValid(password) ){return res.status(400).send({status:false, msg:"password is missing please the enter data to create"})}

    if(password.length <8||password.length >16 ){return res.status(400).send({status:false, msg:" please the password to maximum 8 and minum:16"})}

    const salt = await bcrypt.genSalt(13);
    const encryptedPassword = await bcrypt.hash(password, salt);

    if(!isValid(email) ){return res.status(400).send({status:false, msg:"email is missing please the data to create"})}

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
    }

    const emails = await usermodel.findOne({email : email})

        if(emails){
        return res.status(400).send({status: false, message: "email id is already exist"})
        }


    if(!isValid(role) ){return res.status(400).send({status:false, msg:"role is missing please the data to create"})}

    
    if (!["taxpayer","taxAccountant", "admin"].includes(role.trim())) {
        return res
          .status(400)
          .send({
            status: false,
            message: `title must be provided from these values: taxpayer","taxAccountant", "admin`
          });
      }

    if(!isValid(panNumber) ){return res.status(400).send({status:false, msg:"panNumber is missing please the data to create"})}

    const panNumbers = await usermodel.findOne({panNumber : panNumber})

        if(panNumbers){
        return res.status(400).send({status: false, message: "panNumber id is already exist"})
        }

    if(!isValid(city) ){return res.status(400).send({status:false, msg:"city is missing please the data to create"})}


   const datas={
    username:username,
    password:encryptedPassword ,
    email:email,
    role: role,
    panNumber:panNumber,
    city:city
    }
     
    const create=await usermodel.create(datas)
    return res.status(201).send({status:true,msg:"create data sucesssful",data:create})


    }catch(error){
        return  res.status(500).send({status:false,msg:error.message})
    }

}


const createlogin = async function(req,res){
  try{

    const data =req.body

    const {username,password}=data

    if(Object.keys(data)==0){
        return res.status(400).send({msg:"enter some data to create token"})
    }

    if(!isValid(username)){
    return res.status(400).send({msg:"enter the username create token"})

    }

    const usernames=await usermodel.findOne({username:username})
    if(!usernames){
        return res.status(404).send({msg:"there is no such kind of data"})
    }
    if(!isValid(password)){
        return res.status(400).send({msg:"enter the password create token"})

        }


        if(password.length <8||password.length >16 ){return res.status(400).send({status:false, msg:" please the password to maximum 8 and minum:16"})}


    const isPasswordMatching = await bcrypt.compare(
            password,
            usernames.password
        );

     if(!isPasswordMatching ){
        return res.status(404).send({msg:"password incorrect"})
     }   


    const payload={userId:usernames._id}
    const expriy={expiresIn:"1days"}
    const secret= "ashok"

    

    const token=jwt.sign(payload,secret,expriy);
    //console.log(token)
    res.header("x-api-key",token);

    return res.status(200).send({ status: true, message: "login successful", data: token });


  }catch(error){
    return res.status(500).send({status:false,msg:error.message})
  }
}


const getUser = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
        if (validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "can not pass request body. body is blocked" })
        const userId = req.params.userId


        if (!validator.isObjectId(userId)) return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, msg: "no data found" })


        return res.status(200).send({ status: true, msg: "data found successfully", data: userData })


    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message, msg: "more details move on console", })
    }

}


module.exports={createuser,createlogin,getUser}