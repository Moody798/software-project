const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');
function handlePrivateFrontEndView(app) {

    app.get('/dashboard' , async (req , res) => {
        
        const user = await getUser(req);
        if(user.role == "admin"){
            return res.render('adminHomepage' , {name : user.name});
        }
        // role of customer
        return res.render('customerHomepage' , {name : user.name});
    });
    app.get('/add' , (req , res) => {    
        return res.render('add');
    });
    app.get('/product' , async (req , res) => {  
        let products
        try {
            let user = await getUser(req);
            if (user.role !== "admin") {
              return res.status(400).send("not an admin");
            }
            products = await db.raw(`SELECT * FROM "projectSE"."Product"
            WHERE "ownerId"=${user.userId} and hidden=false
            ORDER BY id ASC `);
          } catch (e) {
            console.log(e.message);
            return res.status(400).send("Could not view product");
          }  
        return res.render('product',{product:products.rows});

    });
    app.get("/api/v1/product/view/:productId", async (req, res) => {
        let product
        try {
          let user = await getUser(req);
          if (user.role !== "admin") {
            return res.status(400).send("not an admin");
          }
          product = await db.raw(`SELECT * FROM "projectSE"."Product"
          WHERE "id"=${req.params.productId}`);
          let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Product"
          WHERE "id"=${req.params.productId}`);
          if (Count.rows[0].count < 1) {
            return res.status(400).send("product not available");
          }
        } catch (e) {
          console.log(e.message);
          return res.status(400).send("product not available");
        }
        return res.render('view',{product:product.rows});
      });
  
}  
  
module.exports = {handlePrivateFrontEndView};
  