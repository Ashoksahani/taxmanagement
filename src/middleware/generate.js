const jwt = require("jsonwebtoken")
const generateToken = async function (user) {
    try {

        let role = user.role
        var token = await jwt.sign({ userId: user._id ,role:role}, "Jyoti Pratap", {
            
            expiresIn: "20d"
           
        });

        token={
            userId:user._id, 
            token:token,
            role: user.role
        }
        return token

    }
    catch (err) {
        console.log(err)
    }
}
module.exports.generateToken=generateToken