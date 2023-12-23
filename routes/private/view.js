const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');
function handlePrivateFrontEndView(app) {

    app.get('/dashboard' , async (req , res) => {
        
        const user = await getUser(req);
        if(user.role == "admin"){
            return res.render('adminHomepage' , {name : user.name});
        }
        let products
        try {
          let user = await getUser(req);
          if (user.role !== "customer") {
            return res.status(400).send("not an customer");
          }
          products = await db.raw(`SELECT * FROM "projectSE"."Product"
          WHERE "hidden"=false ORDER BY id ASC `);
        } catch (e) {
          console.log(e.message);
          return res.status(400).send("Could not view product");
        }
        return res.render('customerHomepage' , {product:products.rows});
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
        let user = await getUser(req);
          if (user.role == "admin") {
            return res.render('view',{product:product.rows});
          }
        return res.render('customerView',{product:product.rows});
      });
      app.get('/cart' , async (req , res) => {  
        let productCart
        let sumTotal
        try {
          let user = await getUser(req);
          if (user.role !== "customer") {
            return res.status(400).send("not an customer");
          }
          productCart =
            await db.raw(`SELECT c.id as "cartId",c."productId" as "productId",p.name as "productName",c.quantity,p.price as "price",p.price*c.quantity as "total"
            FROM "projectSE"."Cart" as c 
            INNER join "projectSE"."Product" as p on c."productId"=p.id
            where c."userId"=${user.id}
            order BY "cartId" ASC `);
          sumTotal= await db.raw(`SELECT SUM(subquery."total") AS total_sum
          FROM (
              SELECT
                  c.id as "cartId",
                  c."productId" as "productId",
                  p.name as "productName",
                  c.quantity,
                  p.price as "price",
                  p.price * c.quantity as "total"
              FROM
                  "projectSE"."Cart" as c 
              INNER JOIN
                  "projectSE"."Product" as p ON c."productId" = p.id
              WHERE
                  c."userId" = ${user.id}
          ) AS subquery;`)
        } catch (e) {
          console.log(e.message);
          return res.status(400).send("Could not view product");
        }
        return res.render('cart',{product:productCart.rows,sumTotal:sumTotal.rows});
    });
      app.get('/orders' , async (req , res) => {  
        let Orders
        try {
          let user = await getUser(req);
          if (user.role !== "customer") {
            return res.status(400).send("not an customer");
          }
          Orders =
            await db.raw(`SELECT
            "po"."orderID" as id,
            P.name AS "ProductName",
            po.quantity
        FROM
            "projectSE"."Order" o
        JOIN
            "projectSE"."ProductOrder" po ON O.id = "po"."orderID"
        JOIN
            "projectSE"."Product" p ON "po"."productID" = p.id
        WHERE
            o."userId" = ${user.id};`);
        } catch (e) {
          console.log(e.message);
          return res.status(400).send("Could not view product");
        }
        return res.render('orders',{orders:Orders.rows});
    });
}  
  
module.exports = {handlePrivateFrontEndView};
  