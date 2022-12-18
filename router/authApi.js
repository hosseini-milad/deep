
const { ErrorMessageBox } = require('admin-bro');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var Kavenegar = require('kavenegar');
const job = require('../model/job');
const user = require('../model/user');
var api = Kavenegar.KavenegarApi({
    apikey: process.env.SMS_API
});
const User = require("../model/user");
const userAddress = require('../model/userAddress');
const userInfo = require('../model/userInfo');
const userCreditSchema = require('../model/userCredit')

//ثبت نام و ورود با نام کاربری پسورد
exports.registerApi = async (req, res) => {
  // Our register logic starts here
  try {
    const { phone, password } = req.body;

    if (!(phone && password )) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ phone });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      phone,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
}
exports.loginApi=async(req,res)=>{
    try {
        // Get user input
        const { phone, password } = req.body;
      console.log(phone,password)
        // Validate user input
        if (!(phone && password)) {
          res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({phone: phone });
        if(!user){
          encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      phone,
      email:phone+"@mgmlenz.com",
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    return(res.status(201).json(user));
        }

        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, phone },
            process.env.TOKEN_KEY,
            {
              expiresIn: "72h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
        if (user && password===user.password){
          const token = jwt.sign(
            { user_id: user._id, phone },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }

        else{
          res.status(400).send("Invalid Password");
        }
        //res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
}
exports.loginManager=async(req,res)=>{
  try {
      // Get user input
      const { phone , manager } = req.body;
    //console.log(phone,password)
      // Validate user input
      if (!(phone && manager)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({phone: phone });
      if(!user){
        return(res.status(400).json("user not found"));
      }

      if (user) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, phone },
          process.env.TOKEN_KEY,
          {
            expiresIn: "72h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }

      else{
        res.status(400).send("Invalid Password");
      }
      //res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
}
//ورود با کد یکبار مصرف
exports.sendOTPApi=async(req,res)=>{
  
  try {
    const { phone } = req.body;
    var otpValue = Math.ceil(Math.random() * 10000);
    while(otpValue<1000)
      otpValue="0"+otpValue;
    const user = await User.findOne({phone: phone });
    
    if(user){
      api.VerifyLookup({
        token: otpValue,
        template: process.env.template,//"mgmVerify",
        receptor: phone
    },);
      await User.updateOne(
        {phone:phone},{$set:{otp:otpValue}});
      res.status(200).json(user);
    }
    else  {
      api.VerifyLookup({
        token: otpValue,
        template: process.env.template,//"mgmVerify",
        receptor: phone
    },);
      await User.create(
        {phone:phone,otp:otpValue,email:phone+"@mgmlenz.com"});
        res.status(200).json({"error":"user created"});
      //res.status(200).json({"error":"user not found"});
      
    }
  }
  catch (error){
    console.log(error)
  }
}
exports.loginOTPApi=async(req,res)=>{
  try {
      // Get user input
      const data ={ phone, otp } = req.body;
  
      // Validate user input
      if (!(phone && otp)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({phone: phone });
      console.log(user , phone)
      if (user && otp===user.otp) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, phone },
          process.env.TOKEN_KEY,
          {
            expiresIn: "6h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      else{
        res.status(200).json({
          "error":"wrong otp"
        });
      }
      //res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
}

//اطلاعات کاربری
exports.userInfoApi=async(req, res) => {
    
  try{
    const userData = await user.findOne({_id:req.headers["userid"]});
    const userInfoData = await userInfo.findOne({userId:req.headers["userid"]});
    const userAddressData = await userAddress.find({userId:req.headers["userid"]});
    const jobData = await job.find();
    res.status(200).send({
      user:userData,
      userInfo:userInfoData,
      userAddress:userAddressData,
      jobData:jobData
    });
  }
  catch{
    res.status(200).send({
      message:"error"
    });
  }
}
exports.userInfoSetApi=async(req, res) => {
    try{
    const data = { 
      userName:req.body.userName,
      phone:req.body.phone,
      userId:req.headers["userid"],
      meliCode:req.body.meliCode,
      birthDate: req.body.birthDate,
      mobile:req.body.mobile,
      email: req.body.email,
      hesab:req.body.hesab,
      job:req.body.job
    }
    const userData = await userInfo.findOne({userId: req.headers["userid"] });
    const users = await User.findOne({_id: req.headers["userid"] })
    console.log(users)
    if(userData){
      const updateUserInfo= await userInfo.updateOne({userId: req.headers["userid"]},{$set:data})
      res.status(200).json({updateuser:updateUserInfo});
    }
    else{
      const newUserInfo= await userInfo.create(data);
      res.status(200).json({newuser:newUserInfo});
    }
    
  }
  catch(err){
    res.status(200).json({err:"error"});
  }
}
exports.userPassApi=async(req, res) => {
try{   
  const data = { 
    password:await bcrypt.hash(req.body.password, 10)
  }
  //const users = await User.findOne({_id: req.headers["userid"] })
  //console.log(users)
  //if(userData){
    const updateUserInfo= await User.updateOne({_id: req.headers["userid"]},{$set:data})
    res.status(200).json({updateuser:updateUserInfo,pass:data.password});
 
}
catch(err){
  res.status(200).json({err:err});
}
}

//آدرس های کاربر
exports.userAddressApi=async(req, res) => {
    
  try{
    const userData = await userAddress.find({phone:req.body.phone});
    res.status(200).send({
      userAddress:userData
    });
  }
  catch{
    res.status(200).send({
      message:"error"
    });
  }
}
exports.userAddressSetApi=async(req, res) => {
    try{
  const {phone } = req.body;
    const data = { 
      phone: phone,
      userId:req.body.userId,
      addressUserName:req.body.addressUserName,
      address:req.body.address,
      state:req.body.state,
      city:req.body.city,
      addressPhone:req.body.addressPhone,
      postalCode:req.body.postalCode,
      location:req.body.location
    }
    //const userData = await userAddress.findOne({phone: phone });
    //res.status(200).json({user:data.userName});
    //if(userData){
    //  const updateUserInfo= await userAddress.updateOne({phone:phone},{$set:data})
    //  res.status(200).json({updateuser:updateUserInfo});
    //}
    //else{
      const newUserInfo= await userAddress.create(data);
      res.status(200).json({newuser:newUserInfo});
    //}
    
  }
  catch(err){
    res.status(200).json({err:err});
  }
}

exports.userEditApi=async(req, res) => {
  
  try{
  const data = { 
    access:req.body.access,
    group:req.body.group,
    password:req.body.password
  }
  res.status(200).json(data)
    //const userEdit= await user.updateOne({_id:req.headers["userid"]},{$set:data});
    //res.status(200).json({userData:userEdit});
  
}
catch(err){
  res.status(200).json({err:"error"});
}
}

exports.userCreditSetApi=async(req, res) => {
  
    try{
    const data = { 
      userId:req.body.userId,
      creditValue:req.body.creditValue,
      creditTime: req.body.creditTime,
      creditDesc:req.body.creditDesc
    }
      const userCredit= await userCreditSchema.create(data);
      res.status(200).json({newCredit:userCredit});
    //}
    
  }
  catch(err){
    res.status(200).json({err:"error"});
  }
}
exports.userCreditListApi=async(req, res) => {
  
  try{
  const data = { 
    userId:req.body.userId
  }
    const userCredit= await userCreditSchema.find(data.userId&&{userId:data.userId});
    res.status(200).json({userCredit:userCredit});
  //}
  
}
catch(err){
  res.status(200).json({err:"error"});
}
}
