const sqlite=require('sqlite3').verbose();

const db=new sqlite.Database('./ecomdb.db',(err)=>{
    if(err){
        console.error(err.message);
        return err.message;
    }
    //console.log("Connected to DataBase.");   
});

/*db.run("create table product(itemid integer PRIMARY KEY AUTOINCREMENT,itemname varchar(20),itemqty integer,itemimg varchar(100),itemprice NUMBER)",(res,err)=>{
    if(err)
        throw err;
    else
        console.log(res);
});*/ 

module.exports=db;