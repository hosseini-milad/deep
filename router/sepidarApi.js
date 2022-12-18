
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const bodyParser = require('body-parser');
const basicUrl = require('../config/sepidarApi');
const jsonParser = bodyParser.json();
const crypto = require('crypto');

var getPem = require('rsa-pem-from-mod-exp');

const sepidarRegisterApi=async(req,res)=>{
    const { sepidarSerial ,sepidarID,sepidarIV} = process.env;
    const {sepidarIp,sepidarPort,sepidarRegister} = process.env;
    const key = sepidarSerial+sepidarSerial;
    const plainText = sepidarID;
    var cipher = crypto.createCipheriv('aes-128-cbc',key,sepidarIV);
    var crypted = cipher.update(plainText,'ascii','base64');  //base64 , hex
    crypted += cipher.final('base64');
    const buff = Buffer.from(sepidarIV, 'utf-8');
    const base64IV = buff.toString('base64');
    //res.json({Cypher:crypted,IV:base64IV})

    const initialPost =JSON.stringify({
        Cypher:crypted,
        IV:base64IV,
        IntegrationID:1003
    })
    const response = await fetch(`${sepidarIp}:${sepidarPort}${sepidarRegister}`,
         {method: 'POST', body: initialPost });
    const data = await response.json();
        
    try{
        res.json({data:data,post:initialPost})
    }
    catch(error){
        res.json(error)
    }
}
router.get('/sepidar-register',sepidarRegisterApi)



const registerApi=async(req,res)=>{
    const { sepidarSerial ,sepidarID,sepidarIV} = process.env;
    
        const key = sepidarSerial+sepidarSerial;
        const plainText = sepidarID;
        var cipher = crypto.createCipheriv('aes-128-cbc',key,sepidarIV);
        var crypted = cipher.update(plainText,'ascii','base64');  //base64 , hex
        crypted += cipher.final('base64');
        //console.log(cipher)
        const buff = Buffer.from(sepidarIV, 'utf-8');
        const base64IV = buff.toString('base64');
        res.json({Cypher:crypted,IV:base64IV})
try{
        /*let decipher = crypto.createDecipheriv('aes-128-cbc',key,iv)
        decipher.setAutoPadding(false)
        let decoded  = decipher.update(crypted,'base64','utf8') //base64 , hex
        decoded  += decipher.final('utf8')
        console.log("Encrypted string (base64):", decoded);
        res.json(crypted)*/


        /*const key = sepidarSerial+sepidarSerial;
        const plainText = sepidarID;
        const encrypted = encrypt(plainText, key, "base64");
        console.log("Encrypted string (base64):", encrypted);
        const decrypted = decrypt(Buffer.from(encrypted, "base64"), key, "utf8")
        console.log("Decrypted string:", decrypted);*/
    }
    catch(error){
        res.json(error)
    }
}
const sepidarRegisterApi2=async(req,res)=>{
    const { sepidarSerial ,sepidarID,sepidarIV} = process.env;
    const {sepidarIp,sepidarPort,sepidarRegister} = process.env;
    const key = sepidarSerial+sepidarSerial;
    const plainText = sepidarID;
    var cipher = crypto.createCipheriv('aes-128-cbc',key,sepidarIV);
    var crypted = cipher.update(plainText,'ascii','base64');  //base64 , hex
    crypted += cipher.final('base64');
    const buff = Buffer.from(sepidarIV, 'utf-8');
    const base64IV = buff.toString('base64');
    //res.json({Cypher:crypted,IV:base64IV})

    const initialPost =JSON.stringify({
        Cypher:crypted,
        IV:base64IV,
        IntegrationID:1003
    })
    const response = await fetch(`${sepidarIp}:${sepidarPort}${sepidarRegister}`,
         {method: 'POST', body: initialPost });
    const data = await response.json();
        
    try{
        res.json({data:data,post:initialPost})
    }
    catch(error){
        res.json(error)
    }
}
router.get('/sepidar-register',sepidarRegisterApi2)



const isAuth=async(req,res)=>{
    const {sepidarIp,sepidarPort,sepidarCheck} = process.env;
    const initialPost =JSON.stringify({
        GenerationVersion:105,
        Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU3LCJwaWQiOm51bGwsInV2ZXIiOjIsImR1cGlkIjoxMywiZHVwdmVyIjoxfQ.g9EPEaNTLLS7q4no89EwZvPSEAKDR8rGj56MWGNgHMM",
        IntegrationID:"1003",
        ArbitraryCode:"F8904511-405C-734C-722F-D094444416E2",
        EncArbitraryCode:"WAqLXhjniykzjMahU9O0YdGALhLljWsCstHPqQ2dmb7wYw84RnjbHdZRR1Evgf50oJtPCwZ87lNHZn0u97nKDA=="
    })
    const response = await fetch(`${sepidarIp}:${sepidarPort}${sepidarCheck}`,
         {method: 'GET', header: initialPost });
    const data = await response.json();
        
    try{
        res.json({data:data,post:initialPost})
    }
    catch(error){
        res.json(error)
    }
try{
        /*let decipher = crypto.createDecipheriv('aes-128-cbc',key,iv)
        decipher.setAutoPadding(false)
        let decoded  = decipher.update(crypted,'base64','utf8') //base64 , hex
        decoded  += decipher.final('utf8')
        console.log("Encrypted string (base64):", decoded);
        res.json(crypted)*/


        /*const key = sepidarSerial+sepidarSerial;
        const plainText = sepidarID;
        const encrypted = encrypt(plainText, key, "base64");
        console.log("Encrypted string (base64):", encrypted);
        const decrypted = decrypt(Buffer.from(encrypted, "base64"), key, "utf8")
        console.log("Decrypted string:", decrypted);*/
    }
    catch(error){
        res.json(error)
    }
}
router.get('/isAuth',isAuth)

const regOnlineApi=async(req,res)=>{
    const { sepidarSerial ,sepidarID} = process.env;
    const key=sepidarSerial+sepidarSerial;
    const sepidarAuthIV="7zzo30dEztSqtFt/GhvH/Q==";
    const sepidarAuthCypher="+HVVV0VEREmZKplF3mjkoXeMDdkQHtPcCzuM/FKKpYt1pSkH+zcUfBn3uVPCRaDWoAlLsc/SUofx2In9gaWfmkwdkUaWV8REYIMCSmemKrWh3CvTON8TFbEUHu+0f4G41a0SovqGIWo8OBz7+nRhRJ+IVkq2j+zMar+OHrWNHRxpBIyzE1OLa9sJkIT6YN+OS8GJPzYfePOIw2q0ZBhq7A==";
    //const ReyhamIV = Buffer.from("ReyhamIV")
    let ivBuff = Buffer.from(sepidarAuthIV, 'base64');
    let iv = ivBuff.toString('ascii');
    
    /*res.status(200).json({cKey:key,
        decypher:iv.length
    })*/
    let decipher = crypto.createDecipheriv('aes-128-cbc',key,iv)
        //decipher.setAutoPadding(false)
        let decoded  = decipher.update(sepidarAuthCypher,'base64','utf8') //base64 , hex
        decoded  += decipher.final('utf8')
        //console.log("Encrypted string (base64):", decoded);
    
    try{ 
        res.status(200).json({cKey:key,
            decypher:decoded
        })
    }
    catch{}
   
}
router.get('/regonline',regOnlineApi)

const loginSepidar=async(req,res)=>{
    const { sepidarSerial ,sepidarID} = process.env;
    
    const plainText = sepidarID;
    const rsaModulus="jvTm/d53nM47NZ4QfnkT6zYXvGDT5O/CZLeiZgoZm6j73o6sHFnby03dtokJBiRbubAq7Bx3ZSY83YM6/GlsZQ=="
    const rsaExponent="AQAB"
    const GUID="991516"
    const UUID=crypto.randomUUID()
    var pem = rsaPublicKeyPem(rsaModulus, rsaExponent);


    const encNewData = crypto.publicEncrypt(pem,Buffer.from(GUID))
    const buff = Buffer.from(encNewData, 'utf-8');
    const enc64 = buff.toString('base64');
    var encMsgB64 = encNewData.toString('base64');
    
    res.json({pem:pem,eData:enc64})
}
router.get('/loginSepidar',loginSepidar)
function rsaPublicKeyPem(modulus_b64, exponent_b64) {
 
    var modulus = Buffer.from(modulus_b64, 'base64');
    var exponent = Buffer.from(exponent_b64, 'base64');
 
    var modulus_hex = modulus.toString('hex')
    var exponent_hex = exponent.toString('hex')
 
    modulus_hex = prepadSigned(modulus_hex)
    exponent_hex = prepadSigned(exponent_hex)
 
    var modlen = modulus_hex.length/2
    var explen = exponent_hex.length/2
 
    var encoded_modlen = encodeLengthHex(modlen)
    var encoded_explen = encodeLengthHex(explen)
    var encoded_pubkey = '30' + 
        encodeLengthHex(
            modlen + 
            explen + 
            encoded_modlen.length/2 + 
            encoded_explen.length/2 + 2
        ) + 
        '02' + encoded_modlen + modulus_hex +
        '02' + encoded_explen + exponent_hex;

    var der_b64 = Buffer.from(encoded_pubkey, 'hex').toString('base64');

    var pem = '-----BEGIN RSA PUBLIC KEY-----\n' 
        + der_b64.match(/.{1,64}/g).join('\n') 
        + '\n-----END RSA PUBLIC KEY-----\n';
 
    return pem
}
function prepadSigned(hexStr) {
    var msb = hexStr[0]
    if (msb < '0' || msb > '7') {
        return '00'+hexStr;
    } else {
        return hexStr;
    }
}

function toHex(number) {
    var nstr = number.toString(16);
    if (nstr.length%2) return '0'+nstr;
    return nstr;
}

// encode ASN.1 DER length field
// if <=127, short form
// if >=128, long form
function encodeLengthHex(n) {
    if (n<=127) return toHex(n)
    else {
        var n_hex = toHex(n)
        var length_of_length_byte = 128 + n_hex.length/2 // 0x80+numbytes
        return toHex(length_of_length_byte)+n_hex
    }
}
const versionApi=async(req,res)=>{
    try{
        fetch(basicUrl.url+basicUrl.apiVersion)
        .then(res => res.text())
        .then(text => res.json(JSON.parse(text)));
    }
    catch(error){
        res.json(error)
    }
}
router.get('/version',versionApi)

const customersApi=async(req,res)=>{
    try{
        fetch(basicUrl.url+basicUrl.apiCustomers)
        .then(res => res.text())
        .then(text => res.json(JSON.parse(text)));
    }
    catch(error){
        res.json(error)
    }
}
router.get('/customers',customersApi)

const itemsApi=async(req,res)=>{
    try{
        fetch(basicUrl.url+basicUrl.apiItems)
        .then(res => res.text())
        .then(text => res.json(JSON.parse(text)));
    }
    catch(error){
        res.json(error)
    }
}
router.get('/items',itemsApi)

module.exports = router


function encrypt(plainText, key, outputEncoding = "base64") {
    const cipher = crypto.createCipheriv("aes-128-cbc", key, "ReyhamCoReyhamCo");
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding);
}

function decrypt(cipherText, key, outputEncoding = "utf8") {
    const cipher = crypto.createDecipheriv("aes-128-cbc", key, "ReyhamCoReyhamCo");
    return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
}

const cryptoApi=async(req,res)=>{
    const { sepidarSerial ,sepidarID,sepidarIV} = process.env;
    const {sepidarIp,sepidarPort,sepidarRegister} = process.env;
    const key = sepidarSerial+sepidarSerial;
    const plainText = sepidarID;
    var cipher = crypto.createCipheriv('aes-128-cbc',key,sepidarIV);
    var crypted = cipher.update(plainText,'utf8','base64');  //base64 , hex
    crypted += cipher.final('base64');
    const buff = Buffer.from(sepidarIV, 'utf-8');
    const base64IV = buff.toString('base64');
    //res.json({Cypher:crypted,IV:base64IV})

    const initialPost =JSON.stringify({
        Cypher:crypted,
        IV:base64IV,
        IntegrationID:1003
    })
    const response = await fetch(`${sepidarIp}:${sepidarPort}${sepidarRegister}`,
         {method: 'POST', body: initialPost });
    const data = await response.json();
        
    try{
        res.json({data:data,post:initialPost})
    }
    catch(error){
        res.json(error)
    }
}
router.get('/crypto',cryptoApi)
