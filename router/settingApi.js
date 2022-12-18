const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
var ObjectID = require('mongodb').ObjectID;

const ColorSchema = require('../model/products/color');
const MirrorSchema = require('../model/products/mirror');
const PagesSchema = require('../model/pages');
const PostSchema = require('../model/products/Post');
const SliderSchema = require('../model/slider');
const fs = require('fs');
const mime = require('mime');

router.post('/upload',jsonParser, async(req, res, next)=>{
    
    // to declare some path to store your converted image
    var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
     
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    let fileName = `MGM-${Date.now().toString()+"-"+req.body.imgName}`;
    //console.log(fileName)
    try {
    fs.writeFileSync("./uploads/setting/" + fileName, imageBuffer, 'utf8');
    return res.send({"status":"success",url:"/uploads/setting/"+fileName});
    } catch (e) {
        res.send({"status":"failed",error:e});
    }
})

router.post('/color',async (req,res)=>{
    try{
        const colorData = await ColorSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:colorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/color/update',async (req,res)=>{
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        colorCode: req.body.colorCode,
        colorPrice:req.body.colorPrice,
        title:req.body.title
    }
    try{
        //var colorData = ''
        const colorData = data.id? await ColorSchema.updateOne({_id:data.id},{$set:data})
        :await ColorSchema.create(data);
        res.json({data:colorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/mirror',async (req,res)=>{
    try{
        const mirrorData = await MirrorSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:mirrorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/mirror/update',async (req,res)=>{
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        colorCode: req.body.colorCode,
        colorPrice:req.body.colorPrice,
        title:req.body.title
    }
    try{
        //var colorData = ''
        const colorData = data.id? await MirrorSchema.updateOne({_id:data.id},{$set:data})
        :await MirrorSchema.create(data);
        res.json({data:colorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/pages',async (req,res)=>{
    try{
        const pagesData = await PagesSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:pagesData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/pages/update',async (req,res)=>{
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        url: req.body.url,
        title: req.body.title,
        description:req.body.description,
        fullDesc:req.body.fullDesc
    }
    try{
        //var colorData = ''
        const pagesData = data.id? await PagesSchema.updateOne({_id:data.id},{$set:data})
        :await PagesSchema.create(data);
        res.json({data:pagesData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/blog',async (req,res)=>{
    try{
        const postData = await PostSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:postData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/blog/update',async (req,res)=>{
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        url: req.body.url,
        title: req.body.title,
        description:req.body.description,
        fullDesc:req.body.fullDesc
    }
    try{
        //var colorData = ''
        const postData = data.id? await PostSchema.updateOne({_id:data.id},{$set:data})
        :await PostSchema.create(data);
        res.json({data:postData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/slider',async (req,res)=>{
    try{
        const sliderData = await SliderSchema.find(req.body.id&&{_id:req.body.id});
        res.json({data:sliderData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/slider/update',async (req,res)=>{
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        description:req.body.description
    }
    try{
        const sliderData = await SliderSchema.updateOne({_id:data.id},{$set:data});
        res.json({slider:sliderData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;