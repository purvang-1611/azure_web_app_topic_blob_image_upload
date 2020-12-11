if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const db = require('../dbconnection');
const product=require('../model/product_model');

const
      express = require('express')
    , router = express.Router()

    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService()

    , getStream = require('into-stream')
    , containerName = 'container1'
;

const handleError = (err, res) => {
    res.status(500);
    res.render('error', { error: err });
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

router.post('/', uploadStrategy, (req, res) => {

    const
          blobName = getBlobName(req.file.originalname)
        , stream = getStream(req.file.buffer)
        , streamLength = req.file.buffer.length
    ;

    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err,result) => {

        if(err) {
            handleError(err);
            return;
        }
        console.log(req.body);
        let imgURL="https://purvangstorage.blob.core.windows.net/"+result.container+"/"+result.name;
        req.body.itemImg=imgURL;
        product.addProduct(req.body,function(err,result){
           if(err)
                throw err;
            else{
                console.log(result);
               // product.deleteAll(function(err){});
               res.render('success', { 
                message: "Successfully Done!!"
            });
                /*product.getProduct(function(err,ros){
                        if(err)
                            throw err;
                        else{
                            console.log(ros);
                            
                            res.render('success', { 
                                message: "Successfully Added"
                            });
                        }
                });*/
            }
            
        });
        
    });
});

module.exports = router;