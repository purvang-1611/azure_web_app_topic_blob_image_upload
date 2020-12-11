const express = require('express');
const router = express.Router();
const product= require('../model/product_model');

router.get('/',(req,res,next)=>{
    product.getProduct((err,result)=>{
        res.render('list', { 
            message: result
        })
    })
})


module.exports=router;