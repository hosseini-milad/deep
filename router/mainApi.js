const catModel = require('../model/products/category');
const Product = require('../model/products/Product');
const slideModel = require('../model/slider');
const services = require('../model/services');
const Posts = require('../model/products/Post');
const brands = require('../model/brands/brand');
const brandsSlider = require('../model/brands/brandsSlider');
const brandsBanner = require('../model/brands/brandsBanner');
const menu = require('../model/menu');
const user = require('../model/user');
const RXSchema = require('../model/Order/rx');
const orders = require('../model/Order/orders');
const userInfo = require('../model/userInfo');
const pages = require('../model/pages');
const mgmInfo = require('../model/mgmInfo');
const Offers = require('../model/Order/Offers');

exports.mainApi=async(req,res)=>{
    try{
        const catData = await catModel.find({});
        //const proDataInit = await (await Product.find());
        const proData = await(await Product.aggregate([{
            $lookup:{
                from : "categories", 
                localField: "categories", 
                foreignField: "_id", 
                as : "catName"
            }}]))
        const slideData = await (await slideModel.find());
        const ServiceData = await services.find();
        const PostData = await Posts.find();
        const BrandSliderData = await brandsSlider.aggregate([{
            $lookup:{
                from : "brands", 
                localField: "brand", 
                foreignField: "_id", 
                as : "brandData"
            }}]);
        res.json({category:catData,
            products:proData,
            slider:slideData,
            brandSlider:BrandSliderData,
            services:ServiceData,
            posts:PostData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.layoutApi=async(req,res)=>{
    try{
        const catData = await catModel.find({});
        const menuData = await menu.find();
        const aboutData = await pages.findOne({url:"about"});
        const storeData = await mgmInfo.findOne({shopCode:"mgm"});
        res.json({category:catData, menu:menuData,about:aboutData,store:storeData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.categoryPageApi=async(req,res)=>{
    try{
        const catData = await catModel.find({});
        const brandData = await brands.find();
        const BrandBannerData = await brandsBanner.aggregate([{
            $lookup:{
                from : "brands", 
                localField: "brand", 
                foreignField: "_id", 
                as : "brandData"
            }}]);
        res.json({
            brands:brandData,
            brandBanner:BrandBannerData,
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
exports.userOrderApi=async(req,res)=>{
    try{
        const userData = await user.aggregate([{
            $lookup:{
                from : "rxes", 
                localField: "_id", 
                foreignField: "userId", 
                as : "orders"
            }},
            {
                $lookup:{
                    from : "userinfos", 
                    localField: "_id", 
                    foreignField: "userId", 
                    as : "userInfo"
                }}
        ]);
        res.json(userData)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
exports.reportApi = async(req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    
    try{const data={
        orderNo:req.body.orderNo,
        status:req.body.status,
        customer:req.body.customer,
        offset:req.body.offset
    }
    
        const allList = await RXSchema.find()
    const reportList = await RXSchema.aggregate([{
        $lookup:{
            from : "users", 
            localField: "userId", 
            foreignField: "_id", 
            as : "userInfo"
        }},
        { $match:data.status?{status:new RegExp('.*' + data.status + '.*')}:{}},
        { $match:data.orderNo?{rxOrderNo:new RegExp('.*' + data.orderNo + '.*')}:{}},
        { $sort: {"date":-1}},
        
        ])
        const filter1Report = data.customer?reportList.filter(item=>item.userInfo[0]&&item.userInfo[0].phone.includes(data.customer)):reportList;
        const orderList = filter1Report.slice(data.offset,data.offset+10)  
        
        
       res.json({filter:orderList,filterList:filter1Report,size:filter1Report.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
exports.customersApi=async(req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    const data={
        customer:req.body.customer,
        customerAlt:req.body.customerAlt,
        group:req.body.group,
        offset:req.body.offset?req.body.offset:"0"
    }
    try{
        //const userCount = (await user.find()).length;
        const userData = await user.find(data.customer?{$or:[
            {phone:new RegExp('.*' + data.customer + '.*')},
            {cName:new RegExp('.*' + data.customer + '.*')},
            {cName:new RegExp('.*' + data.customerAlt + '.*')}]}:{})
            .find(data.group&&{group:data.group})
        .skip(data.offset).limit(pageSize);
        
        
        const userAll = await user.find(data.customer?{$or:[
            {phone:new RegExp('.*' + data.customer + '.*')},
            {cName:new RegExp('.*' + data.customer + '.*')}]}:{})
            .find(data.group&&{group:data.group})
        const totalUser = await user.find();
        //const filter1Report = data.customer?userData.filter(item=>item.phone.includes(data.customer)):userData;
        //const filter2Report = data.group?filter1Report.filter(item=>item.group===data.group):filter1Report;
        const userGroup = [...new Set(totalUser.map(item=>item.group))];
        res.json({customers:userData,userData:userAll,size:userAll.length,userGroup:userGroup})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.userMainInfo = async(req,res)=>{
    var userId = req.body.userId;
    try{
    const userData = await userInfo.findOne({userId:userId}) 
    const orderData = await RXSchema.find({userId:userId})
    const offerData = await Offers.find({userId:userId})
    res.json({userInfo:userData,orderData:orderData,offerData:offerData})
    }catch{

    }

}

exports.userDetailInfo = async(req,res)=>{
    var phone = req.body.userId;
    
        const rawUser = await user.findOne({phone:phone})
        if(rawUser){
        const userData = await userInfo.findOne({userId:rawUser._id}) 
        const orderData = await RXSchema.find({userId:rawUser._id})
        const offerData = await Offers.find({userId:rawUser._id})
        res.json({rawUser:rawUser,userInfo:userData,orderData:orderData,offerData:offerData})
        }
    try{    
    }
    catch{
        res.json({error:"error occure"})
    }
}
