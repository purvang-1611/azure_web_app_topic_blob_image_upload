const db=require('../dbconnection');

const product={
    getProduct(callback){
        return db.all("select * from product",callback);
    },
    addProduct(data,callback){
        console.log(data);
        var smt="insert into product(itemname,itemprice,itemqty,itemimg) values(?,?,?,?)";
        return db.run(smt,[data.itemName,data.itemPrice,data.itemQty,data.itemImg],callback);
        
    },
    deleteAll(callback){
        return db.run("delete from product",callback);
    }
}

module.exports=product;

