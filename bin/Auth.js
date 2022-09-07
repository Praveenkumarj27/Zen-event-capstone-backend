var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var dotenv=require('dotenv')
const saltRound = 10

const hashPassword = async (password)=>{
    var salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password,salt) 
}

const hashCompare = async (password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}


const createToken = async ({email,role})=>{
    // console.log(process.env.expiresIn)
    let token = await jwt.sign({email,role},process.env.JWTsecretKey)
    return token   
}

const decodeToken = async(token)=>{
    let data = await jwt.decode(token)
    return data
}
const authenticate = function (req, res, next) {
    if (req.headers.authorization) {
        let verify = jwt.verify(req.headers.authorization, secret);
        if (verify) {
            next()
        } else {
            res.status(401).json({
                message: "Unauthorized!"
            })
        }
    } 
  }
module.exports={hashCompare,hashPassword,createToken,decodeToken,authenticate}