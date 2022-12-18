const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
var ObjectID = require('mongodb').ObjectID;

const lenzStockSchema = require('../model/Order/stock');
const ManSchema = require('../model/Order/manufacture');
const OrdersSchema = require('../model/Order/orders');
const ManufactureStateSchema= require('../model/brands/manufacture')
const RXSchema = require('../model/Order/rx');
const ColorSchema = require('../model/products/color');
const MirrorSchema = require('../model/products/mirror');
const CoverSchema = require('../model/products/cover');
const userSchema = require('../model/user');
const KharidSchema = require('../model/Order/Kharid')
const userInfo = require('../model/userInfo');
const transferMethod = require('../model/products/transferMethod');
const paymentMethod = require('../model/products/paymentMethod');
const param = require('../model/Params/param');
const orders = require('../model/Order/orders');
const sepidarstock = require('../model/Order/sepidarstock');

const reyhamConcat = (osArray,odArray) =>{
    //console.log("osStock: ",osArray)
    //console.log("odStock: ",odArray)
    var result = [];
    if(osArray.length===0&&odArray.length===0)return(result)
    //const brand = osArray[0]?osArray[0]:odArray[0];
    var osStockArray = JSON.stringify(osArray).replace(/sph/g,'osSPH');
        osStockArray = JSON.parse(osStockArray.replace(/cyl/g,'osCYL').replace(/price/g,'osPrice'));
        
    var odStockArray = JSON.stringify(odArray).replace(/sph/g,'odSPH');
        odStockArray = JSON.parse(odStockArray.replace(/cyl/g,'odCYL').replace(/price/g,'odPrice'));
        
    if(!osStockArray.length)return(odStockArray)
    if(!odStockArray.length)return(osStockArray)
    for(var i=0;i<osStockArray.length;i++){
        for(var j=0;j<odStockArray.length;j++){
            if(osStockArray[i].brandName === odStockArray[i].brandName&&
                osStockArray[i].material === odStockArray[i].material&&
                osStockArray[i].lenzIndex === odStockArray[i].lenzIndex&&
                osStockArray[i].coating === odStockArray[i].coating){
                const rep = result.find(item=>item.sku===osStockArray[i].sku+"|"+odStockArray[i].sku)
                !rep&&result.push({
                sku:osStockArray[i].sku+"|"+odStockArray[i].sku,
                brandName:osStockArray[i].brandName,
                material:osStockArray[i].material,
                lenzIndex:osStockArray[i].lenzIndex,
                coating:osStockArray[i].coating,
                
                osSPH:osStockArray[i].osSPH,
                osCYL:osStockArray[i].osCYL,
                osPrice:osStockArray[i].osPrice,

                odSPH:odStockArray[i].odSPH,
                odCYL:odStockArray[i].odCYL,
                odPrice:odStockArray[i].odPrice,
            
            })}
        }
    }
    return(result)
}
router.post('/stock/list',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";

    const data={
        brand:req.body.brand,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        coating:req.body.coating,
        offset:req.body.page,

        odSph:req.body.odSph,
        odCyl:req.body.odCyl,
        osSph:req.body.osSph,
        osCyl:req.body.osCyl,
        dia:req.body.dia,
        add:req.body.add,
        design:req.body.design,
        align:req.body.align,
        
    }
    try{
        var sortPhrase=JSON.parse(
            `{"${req.body.sort?req.body.sort:"sku"}"
            :${req.body.sortAsc?1:-1}}`);
        const stockData = await sepidarstock
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{})
        .find(data.coating?{coating:data.coating}:{})
        .find(data.design?{design:data.design}:{})
        .find(data.align?{align:data.align}:{})
        const odStock = stockData.filter(item=>(data.odSph&&item.sph===data.odSph&&item.cyl===(data.odCyl?data.odCyl:"0.00")));
        const osStock = stockData.filter(item=>(data.osSph&&item.sph===data.osSph&&item.cyl===(data.osCyl?data.osCyl:"0.00")));
        const stockResult = reyhamConcat(osStock,odStock); 
        const stockOffset = stockResult.slice(data.offset,data.offset+10)   
    
        const brandList = [...new Set(stockResult.map(item=>item.brandName))];
        //const brandList = await ManSchema.distinct('brandName')
        const lenzIndexList = [...new Set(stockData.map(item=>item.lenzIndex))];
        const materialList = [...new Set(stockData.map(item=>item.material))];
        const coatingList = [...new Set(stockData.map(item=>item.coating))];
        const designList = [...new Set(stockData.map(item=>item.design))];
        const alignList = [...new Set(stockData.map(item=>item.align))];
        
        
        res.json({stock:stockOffset,stockOD:odStock,stockOS:osStock,
            brandList:brandList,lenzIndexList:lenzIndexList,
            materialList:materialList,coatingList:coatingList,size:stockResult.length,
            alignList:alignList,designList:designList
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}) 
router.post('/stock/adminlist',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    const data={
        brand:req.body.brand,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        coating:req.body.coating,
        offset:req.body.page,

        sph:req.body.sph,
        cyl:req.body.cyl,
        dia:req.body.dia,
        add:req.body.add,
        sphF:req.body.sphF?req.body.sphF:0,
        sphT:req.body.sphT,
        sphFix:req.body.sphFix,
        cylFix:req.body.cylFix,
        align:req.body.align,
        design:req.body.design,
        
    }
    var cylArr=[];
    for(var i=0;i<8;i++)
        cylArr.push(parseFloat(parseFloat(data.cyl)+.25*i).toFixed(2))
    
    try{
        var sortPhrase=JSON.parse(
            `{"${req.body.sort?req.body.sort:"sku"}"
            :${req.body.sortAsc?1:-1}}`);
        const stockData = await sepidarstock
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{})
        .find(data.coating?{coating:data.coating}:{})
        .find(data.dia?{dia:data.dia}:{})
        .find(data.add?{add:data.add}:{})
        .find(data.align?{align:data.align}:{})
        .find(data.design?{design:data.design}:{})
        .find(data.sphFix?{sph:data.sphFix}:{})
        .find(data.cylFix?{cyl:data.cylFix}:{})

        //.find(data.sph?{sph:{$in:data.sph}}:{})
        .find(data.cyl?{cyl:{$in:cylArr}}:{})
        .find(data.sphT&&{"sph" : {$ne: ""},"$expr" : 
            {$and:[{$lte: [ { $toDouble: "$sph" }, data.sphT ]}, 
                  {$gte: [ { $toDouble: "$sph" }, data.sphF ]}] }})
                  
    
    const pagingData = await sepidarstock
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{})
        .find(data.coating?{coating:data.coating}:{})
        .find(data.cyl?{cyl:{$in:cylArr}}:{})
        .find(data.dia?{dia:data.dia}:{})
        .find(data.add?{add:data.add}:{})
        .find(data.align?{align:data.align}:{})
        .find(data.design?{design:data.design}:{})
        .find(data.sphFix?{sph:data.sphFix}:{})
        .find(data.cylFix?{cyl:data.cylFix}:{})
        //.find(data.sphP?{sph:{$gt:"+5.25"}}:{})
        
        
        .find(data.sphT?{"sph" : {$ne: ""},"$expr" : 
            {$and:[{$lte: [ { $toDouble: "$sph" }, data.sphT ]}, 
                  {$gte: [ { $toDouble: "$sph" }, data.sphF ]}] }}:{})
        
        .sort(sortPhrase).skip(data.offset).limit(parseInt(pageSize))

        const brandList = [...new Set(stockData.map(item=>item.brandName))];
        //const brandList = await ManSchema.distinct('brandName')
        const lenzIndexList = [...new Set(stockData.map(item=>item.lenzIndex))];
        const materialList = [...new Set(stockData.map(item=>item.material))];
        const coatingList = [...new Set(stockData.map(item=>item.coating))];
        const skuList=stockData.map(item=>item.sku);
        
        const designList = [...new Set(stockData.map(item=>item.design))];
        const alignList = [...new Set(stockData.map(item=>item.align))];

        res.json({stock:pagingData,brandList:brandList,lenzIndexList:lenzIndexList,
            materialList:materialList,coatingList:coatingList,size:stockData.length,
            allStock:skuList,in:data, designList:designList,alignList:alignList
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}) 
router.post('/stock/add',jsonParser,async (req,res)=>{
    const data = {
        id:req.body.id,
        sku: req.body.sku,
        od: req.body.od,
        count:req.body.count,
        sph:req.body.sph,
        cyl:req.body.cyl,
        dia:req.body.dia,
        add:req.body.add,
        design:req.body.design,
        align:req.body.align,

        brandName:req.body.brandName,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        coating:req.body.coating,

        price:req.body.price,
        discount:req.body.discount,
    }
    try{
        //const existStock = await sepidarstock.find({_id:data.id});
        
        if(data.id){
            const stockData = await sepidarstock.updateOne({_id:data.id},{$set:data})
            res.json({stock:stockData,message:"update"})
        }
        else{
            const stockData = await sepidarstock.create(data)
            res.json({stock:stockData,message:"new"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/stock/remove',jsonParser,async (req,res)=>{
    const data = {
        id:req.body.id,
    }
    try{
        const existStock = await sepidarstock.deleteOne({_id:data.id});
        res.json({message:"deleted"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/stock/price',jsonParser,async (req,res)=>{
    try{
        const stockData = await sepidarstock.updateMany({sku:{$in:req.body.sku}},{$set:{price:req.body.price}})
        res.json({stock:stockData,message:"update"})
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/stock/find',jsonParser,async (req,res)=>{
    const stockList = req.body.sku.split('|');
    try{
        const stockData = await sepidarstock.find({sku:{$in:stockList}});
        res.json(stockData)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/stockOld/list',jsonParser,async (req,res)=>{
    
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    try{
    const data={
        brand:req.body.brand,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        coating:req.body.coating,
        offset:req.body.page,

        sphOD:req.body.sphOD,
        cylOD:req.body.cylOD,
        axisOD:req.body.axisOD,
        addOD:req.body.addOD,
        
        sphOS:req.body.sphOS,
        cylOS:req.body.cylOS,
        axisOS:req.body.axisOS,
        addOS:req.body.addOS,
    }
        var sortPhrase=JSON.parse(
            `{"${req.body.sort?req.body.sort:"sku"}"
            :${req.body.sortAsc?1:-1}}`);
        const stockData = await lenzStockSchema
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{})
        .find(data.coating?{coating:data.coating}:{})

        .find(data.sphOD?{sphOD:data.sphOD}:{})
        .find(data.cylOD?{cylOD:data.cylOD}:{})
        .find(data.axisOD?{axisOD:data.axisOD}:{})
        .find(data.addOD?{addOD:data.addOD}:{})
        .find(data.sphOS?{sphOS:data.sphOS}:{})
        .find(data.cylOS?{cylOS:data.cylOS}:{})
        .find(data.axisOS?{axisOS:data.axisOS}:{})
        .find(data.addOS?{addOS:data.addOS}:{})

        const pagingData = await lenzStockSchema
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{})
        .find(data.coating?{coating:data.coating}:{})

        .find(data.sphOD?{sphOD:data.sphOD}:{})
        .find(data.cylOD?{cylOD:data.cylOD}:{})
        .find(data.axisOD?{axisOD:data.axisOD}:{})
        .find(data.addOD?{addOD:data.addOD}:{})
        .find(data.sphOS?{sphOS:data.sphOS}:{})
        .find(data.cylOS?{cylOS:data.cylOS}:{})
        .find(data.axisOS?{axisOS:data.axisOS}:{})
        .find(data.addOS?{addOS:data.addOS}:{})
        .sort(sortPhrase).skip(data.offset).limit(parseInt(pageSize))
        res.json({stock:pagingData,size:stockData.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}) 

router.post('/stockOld/add',jsonParser,async (req,res)=>{
    try{
    const data = {
        id:req.body.id,
        sku: req.body.sku,
        od: req.body.od,
        count:req.body.count,
        sphOD:req.body.sphOD,
        cylOD:req.body.cylOD,
        axisOD:req.body.axisOD,
        addOD:req.body.addOD,
        os: req.body.os,
        sphOS:req.body.sphOS,
        cylOS:req.body.cylOS,
        axisOS:req.body.axisOS,
        addOS:req.body.addOS,

        brandName:req.body.brandName,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        coating:req.body.coating,
        design:req.body.design,

        priceOS:req.body.priceOS,
        discountOS:req.body.discountOS,
        priceOD:req.body.priceOD,
        discountOD:req.body.discountOD,
    }
        const existStock = await lenzStockSchema.find({_id:data.id});
        
        if(existStock.length){
            const stockData = await lenzStockSchema.updateOne({_id:data.id},{$set:data})
            res.json({stock:stockData,message:"update"})
        }
        else{
            const stockData = await lenzStockSchema.create(data)
            res.json({stock:stockData,message:"new"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/stockOld/find',jsonParser,async (req,res)=>{
    try{
        const stockData = await lenzStockSchema.findOne({sku:req.body.sku});
        res.json(stockData)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/manufacture/list',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    const data={
        facoryName:req.body.facoryName,
        brand:req.body.brand,
        lenzType:req.body.lenzType,
        lenzDesign:req.body.lenzDesign,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        offset:req.body.page,
    }
    const activeMan=await ManufactureStateSchema.find({state:"فعال"}).distinct("enTitle")
    
    try{
        var sortPhrase=JSON.parse(
            `{"${req.body.sort?req.body.sort:"sku"}"
            :${req.body.sortAsc?1:-1}}`);
        const manData = await ManSchema
        .find(data.facoryName?{facoryName:data.facoryName}:
            req.body.access?{}:{
            facoryName : { $in: activeMan } 
        })
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzType?{lenzType:data.lenzType}:{})
        .find(data.lenzDesign?{lenzDesign:data.lenzDesign}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{});
        const pageData = await ManSchema
        .find(data.facoryName?{facoryName:data.facoryName}:
            req.body.access?{}:{
            facoryName : { $in: activeMan } 
        })
        .find(data.brand?{brandName:data.brand}:{})
        .find(data.lenzType?{lenzType:data.lenzType}:{})
        .find(data.lenzDesign?{lenzDesign:data.lenzDesign}:{})
        .find(data.lenzIndex?{lenzIndex:data.lenzIndex}:{})
        .find(data.material?{material:data.material}:{})
        .sort(sortPhrase).skip(data.offset).limit(parseInt(pageSize));
        const manufactureList = //req.body.access?
            [...new Set(manData.map(item=>item.facoryName))]
        const brandList = [...new Set(manData.map(item=>item.brandName))];
        //const brandList = await ManSchema.distinct('brandName')
        const lenzTypeList = [...new Set(manData.map(item=>item.lenzType))];
        const lenzDesignList = [...new Set(manData.map(item=>item.lenzDesign))];
        const lenzIndexList = [...new Set(manData.map(item=>item.lenzIndex))];
        const materialList = [...new Set(manData.map(item=>item.material))];
        const coridorList = [...new Set(manData.map(item=>item.coridor))];
        res.json({manData:pageData,manufacture:manufactureList,
            brandList:brandList,lenzType:lenzTypeList,
            lenzDesign:lenzDesignList,lenzIndex:lenzIndexList,
            material:materialList,coridor:coridorList,
            size:manData.length,rawData:manData,activeMan:activeMan
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}) 
router.post('/manufacture/find',jsonParser,async (req,res)=>{
    
    try{
        const manData = await ManSchema.findOne({sku:req.body.sku});
        res.json(manData)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}) 
router.post('/manufacture/add',jsonParser,async (req,res)=>{
    try{
    const data = {
        //sku: req.body.sku,
        id:req.body.id,
        facoryName:req.body.facoryName,
        brandName:req.body.brandName,
        lenzIndex:req.body.lenzIndex,
        material:req.body.material,
        lenzType:req.body.lenzType,
        lenzDesign:req.body.lenzDesign,
        coridor:req.body.coridor,

        lenzPrice:req.body.lenzPrice,
        lenzDiscount:req.body.lenzDiscount,
        
    }
    const existMan = await ManSchema.find({_id:data.id});
        
        if(existMan.length){
            const manData = await ManSchema.updateOne({_id:req.body.id},{$set:data})
            res.json({manufacture:manData,message:"update"})
        }
        else{
            if(req.body.sku){
                const oldData = await ManSchema.find({sku:req.body.sku})
            
                if(oldData.length){
                    res.json({error: "شناسه محصول تکراری است"})
                    return;
                }
                const manData = await ManSchema.create({...data,sku:req.body.sku})
                res.json({manufacture:manData,message:"new"})
            }
            else{
                var lastItem = await ManSchema.findOne().sort({"sku":-1})
                var lastSku = (parseInt(lastItem.sku)+1).toString();
                const manData = await ManSchema.create({...data,sku:lastSku})
                res.json({manufacture:manData,message:lastSku +" created"}) 
            }

        } 
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


router.get('/color',async (req,res)=>{
    try{
        const colorData = await ColorSchema.find().sort({"sort":1});
        const mirrorData = await MirrorSchema.find().sort({"sort":1});
        const coverData = await CoverSchema.find()
        res.json({color:colorData,mirror:mirrorData,cover:coverData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/params',async (req,res)=>{
    try{
        const paramData = await param.find()
        res.json(paramData)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


router.post('/addItemOld',jsonParser, auth,async (req,res)=>{

    const data = {
        id:req.body.id,
        userId:req.headers["userid"],
        stockId: req.body.stockId,
        stockOrderNo: req.body.stockOrderNo,

        stockOrderPrice: req.body.stockOrderPrice,
        stockFaktor: req.body.stockFaktor,
        /*        frameShape: req.body.frameShape,
        count:req.body.count,
        odIPD:req.body.odIPD,
        odFH:req.body.odFH,
        osIPD: req.body.osIPD,
        osFH:req.body.osFH,
        framePrice:req.body.framePrice,

        colorCode:req.body.colorCode,
        colorPrice:req.body.colorPrice,

        coverCode:req.body.coverCode,
        coverPrice:req.body.coverPrice,

        mirrorCode:req.body.mirrorCode,
        mirrorPrice:req.body.mirrorPrice,

        extraInformation:req.body.extraInformation,
        
        warrantyPrice:req.body.warrantyPrice,
*/
        status:req.body.status,
        date: Date.now()
    } 
    try{
    const stockData = await lenzStockSchema.findOne({_id:data.stockId});
    const price={
        extraPrice:SumPrices([data.framePrice,data.colorPrice,
                   data.coverPrice,data.mirrorPrice]),
        lenzPrice:SumPrices([stockData.priceOD,stockData.priceOS]),
        totalDiscount:stockData.discountOS,
        
    }
    const totalPrice=SumPrices([price.extraPrice,price.lenzPrice,-price.totalDiscount]);
    
        const existOrderItem = await OrdersSchema.find({_id:data.id});
        if(existOrderItem.length){
            const orderData = await OrdersSchema.updateOne({_id:data.id},{$set:data})
            res.json({order:orderData,message:"update"})
        }
        else{
            const orderData = await OrdersSchema.create({...data,...price,totalPrice:totalPrice})
            res.json({order:orderData,message:"new"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/updateItemOld',jsonParser, auth,async (req,res)=>{
    const data = {
        status:req.body.status,
    } 
    try{
        const orderData = await OrdersSchema.updateOne({_id:req.body.id},{$set:data})
            res.json({order:orderData,message:"update"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/addItem',jsonParser, auth,async (req,res)=>{
    try{const data = {
        id:req.body.id,
        userId:req.headers["userid"],
        manageId:req.headers["manageId"],
        stockId: req.body.stockId,
        stockOrderNo: req.body.stockOrderNo,

        stockOrderPrice: req.body.stockOrderPrice,
        stockFaktor: req.body.stockFaktor,
        
        status:req.body.status,
        date: Date.now()
    } 
    const stockData = await lenzStockSchema.findOne({_id:data.stockId});
    const price={
        extraPrice:SumPrices([data.framePrice,data.colorPrice,
                   data.coverPrice,data.mirrorPrice]),
        lenzPrice:SumPrices([stockData.priceOD,stockData.priceOS]),
        totalDiscount:stockData.discountOS,
        
    }
    const totalPrice=SumPrices([price.extraPrice,price.lenzPrice,-price.totalDiscount]);
    
        const existOrderItem = await OrdersSchema.find({_id:data.id});
        if(existOrderItem.length){
            const orderData = await OrdersSchema.updateOne({_id:data.id},{$set:data})
            res.json({order:orderData,message:"update"})
        }
        else{
            const orderData = await OrdersSchema.create({...data,...price,totalPrice:totalPrice})
            res.json({order:orderData,message:"new"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/updateItem',jsonParser, auth,async (req,res)=>{
    try{
    const data = {
        status:req.body.status,
    } 
        const orderData = await OrdersSchema.updateOne({_id:req.body.id},{$set:data})
            res.json({order:orderData,message:"update"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/addrx',jsonParser, auth,async (req,res)=>{
    try{
    const data = {
        id:req.body.id,
        userId:req.headers["userid"],
        manageId:req.headers["manageId"],
        consumer: req.body.consumer,
        rxLenz: req.body.rxLenz,
        rxOrderNo:req.body.rxOrderNo,
        rxFaktorNo:req.body.rxFaktorNo,
        lastIndex:req.body.lastIndex,

        odMain:req.body.odMain,
        odMore:req.body.odMore,
        
        osMore:req.body.osMore,
        osMain:req.body.osMain,
        copyLeftRight:req.body.copyLeftRight,
        singleLens:req.body.singleLens,

        frameSize:req.body.frameSize,
        frameType:req.body.frameType,
        frameImg:req.body.frameImg,

        colorCode:req.body.colorCode,
        colorPrice:req.body.colorPrice,

        coverCode:req.body.coverCode,
        coverPrice:req.body.coverPrice,
        coridor:req.body.coridor,

        mirrorCode:req.body.mirrorCode,
        mirrorPrice:req.body.mirrorPrice,

        lanti:req.body.lanti,
        NazokTigh:req.body.NazokTigh,
        NazokTighPrice:req.body.NazokTighPrice,
        extraInformation:req.body.extraInformation,
        viewValue:req.body.viewValue,
        studyDistance:req.body.studyDistance,
        job:req.body.job,
        moreInformation:req.body.moreInformation,
        
        expressPrice:req.body.expressPrice,
        totalPrice:req.body.totalPrice,
        status:req.body.status,
        date: Date.now()
    } 
        const existOrderItem = await RXSchema.findOne({userId:data.userId,status:"initial"});
        
        if(existOrderItem){
            const rxData = await RXSchema.updateOne({userId:data.userId,status:"initial"},{$set:data})
            res.json({rx:rxData,message:"update"})
        }
        else{
            const rxData = await RXSchema.create(data)
            res.json({rx:rxData,message:"new"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/addstock',jsonParser, auth,async (req,res)=>{
    try{
    const data = {
        userId:req.headers["userid"],
        stockOrderNo:req.body.stockOrderNo,
        stockOrderPrice:req.body.stockOrderPrice,
        stockFaktor:req.body.stockFaktor,
        status:req.body.status,
        date: Date.now()
    } 

        const stockData = await OrdersSchema.create(data)//{_id:req.body.id},{$set:data})
            res.json({stock:stockData,message:"order register"})

        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/rxList',jsonParser,auth,async(req,res)=>{
    try{
        const rxData = await RXSchema.find({ userId:req.headers["userid"]});
        const stockData = await OrdersSchema.find({ userId:req.headers["userid"]});
        const userData = await userInfo.findOne({userId:req.headers['userid']})
        res.json({rxData:rxData,stockData:stockData,userInfo:userData})
    }
    catch{
        res.status(500).json({message: error.message})
    }
})
router.get('/rxListAll',jsonParser,auth,async(req,res)=>{
    try{
        const rxData = await RXSchema.find();
        const stockData = await OrdersSchema.find();
        const userData = await userSchema.findOne({_id:req.headers['userid']})
        console.log(userData)
        res.json({rxData:rxData,stockData:stockData,userInfo:userData})
    }
    catch{
        res.status(500).json({message: error.message})
    }
})

router.post('/manage/addrx',jsonParser, auth,async (req,res)=>{
    try{
    const data = {
        status:req.body.status,
        progressDate: Date.now()
    } 
    
        const rxData = await RXSchema.updateOne({
                rxOrderNo:req.body.rxOrderNo},{$set:data})
        res.json({rx:rxData,message:"update"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/manage/addstock',jsonParser, auth,async (req,res)=>{
    try{
    const data = {
        status:req.body.status,
        progressDate: Date.now()
    } 
    
        const stockData = await OrdersSchema.updateOne({
            stockOrderNo:req.body.stockOrderNo},{$set:data})
        res.json({stock:stockData,message:"update"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/manage/rxList',jsonParser,auth,async(req,res)=>{
    try{
        const inprogressList = await RXSchema.find({ status:"inprogress"});
        const acceptList = await RXSchema.find({ status:"accept"});
        const inproductionList = await RXSchema.find({ status:"inproduction"});
        const faktorList = await RXSchema.find({ status:"faktor"});
        const sendingList = await RXSchema.find({ status:"sending"});
        const deliveredList = await RXSchema.find({ status:"delivered"});
        const sentStoreList = await RXSchema.find({ status:"sentStore"});
        const cancelList = await RXSchema.find({ status:{$regex :"cancel"}});
        
        const userData = await userSchema.findOne({_id:req.headers['userid']})
        res.json({inprogress:inprogressList,accept:acceptList,
            inproduction:inproductionList,faktor:faktorList,sending:sendingList,
            delivered:deliveredList,cancel:cancelList,sentStore:sentStoreList,
        userInfo:userData})
    }
    catch{
        res.status(500).json({message: error.message})
    }
})

router.post('/addKharid',jsonParser, auth,async (req,res)=>{
    try{
    const data = {
        id:req.body.id,
        rxLenz: req.body.rxLenz,
        rxCount: req.body.rxCount,
        rxOrderNo:req.body.rxOrderNo,
        rxFaktorNo:req.body.rxFaktorNo,
        rxFaktorName:req.body.rxFaktorName,

        date: Date.now()
    } 
        const existKharidItem = await KharidSchema.findOne({rxLenz:data.rxLenz,rxFaktorNo:data.rxFaktorNo});
        
        if(existKharidItem){
            
            res.json({message:"error"})
        }
        else{
            const rxKharid = await KharidSchema.create(data)
            res.json({Kharid:rxKharid,message:"new"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/kharidList', auth,async(req,res)=>{
    try{
        const kharidList = await KharidSchema.find();
        res.json(kharidList)
    }
    catch{
        res.status(500).json({message: error.message})
    }
})

router.post('/fetch-order',jsonParser, async (req,res)=>{
    const data = {
        rxOrderNo: req.body.rxOrderNo,
    } 
    try{
        const existOrder = await RXSchema.findOne({rxOrderNo:data.rxOrderNo});
        
        if(existOrder){
            
            res.json(existOrder)
        }
        else{
            res.status(500).json({message: "not found"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/cart', auth,async (req,res)=>{
    
    try{
        const cartData = await OrdersSchema.aggregate([
            { $match : { userId : ObjectID(req.headers["userid"]) } },
            { $match : { status : "initial" } },
            {$lookup:{
                from : "stocks", 
                localField: "stockId", 
                foreignField: "_id", 
                as : "stockDetail"
            }},
        ])
        var totalPrice = "0";
        var totalDiscount = "0";
        for(var indx=0;indx<cartData.length;indx++){
            totalPrice= SumPrices([totalPrice,cartData[indx].totalPrice])
            totalDiscount=SumPrices([totalDiscount,cartData[indx].totalDiscount])
        }
        res.json({cart:{items:cartData,totalPrice:totalPrice,totalDiscount:totalDiscount,orderId:"MGM1401"+Date.now()}})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/cartside', async (req,res)=>{
    const transData = await transferMethod.find().sort({"sort":1});
    const paymentData = await paymentMethod.find().sort({"sort":1});
    res.json({transferMethod:transData,paymentMethod:paymentData})
})


const SumPrices =(prices)=>{
    var outResult = 0;
    for(var index=0;index<prices.length;index++){
        if(prices[index])
            outResult+=parseInt(prices[index].toString().replace(/,/g,''))
    }
    return(outResult.toString())
}
module.exports = router;