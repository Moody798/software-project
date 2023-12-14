const db = require("../../connectors/db");
// check function getUser in milestone 2 description and session.js
const { getUser } = require("../../utils/session");

function handlePrivateBackendApi(app) {
  // insert all your private server side end points here

  //
  //admin
  //
  app.post("/api/v1/product/new", async (req, res) => {
    try {
      let user = await getUser(req);
      let ownerId = user.userId;
      if (user.role !== "admin") {
        return res.status(400).send("not an admin");
      }
      let { name, quantity, category, description } = req.body;

      await db.raw(
        `insert into "projectSE"."Product"(name,quantity,category,description,"ownerId") 
        values('${name}', ${quantity}, '${category}', '${description}', ${ownerId});`
      );
      return res.status(200).send("product created successfully");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not add product");
    }
  });
  app.get("/api/v1/product/view", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "admin") {
        return res.status(400).send("not an admin");
      }
      const products = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "ownerId"=${user.userId} and hidden=false
      ORDER BY id ASC `);
      return res.status(200).send(products.rows);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not view product");
    }
  });
  app.get("/api/v1/product/view/:productId", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "admin") {
        return res.status(400).send("not an admin");
      }
      const product = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "id"=${req.params.productId}`);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Product"
      WHERE "id"=${req.params.productId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("product not available");
      }
      return res.status(200).send(product.rows);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("product not available");
    }
  });
  app.put("/api/v1/product/edit/:productId", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "admin") {
        return res.status(400).send("not an admin");
      }
      const product = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "id"=${req.params.productId}`);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Product"
      WHERE "id"=${req.params.productId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("product not available");
      }
      if (product.rows[0].ownerId !== user.userId) {
        return res
          .status(400)
          .send("you can not edit this product as you are not the owner");
      }
      let { name, quantity, category, description } = req.body;
      await db.raw(`update "projectSE"."Product"
      SET name='${name}', quantity=${quantity}, category='${category}', description='${description}'WHERE "id"=${req.params.productId}`);
      return res.status(200).send("product updated successfully");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("couldn't edit product");
    }
  });
  app.delete("/api/v1/product/delete/:productId", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "admin") {
        return res.status(400).send("not an admin");
      }
      const product = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "id"=${req.params.productId}`);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Product"
      WHERE "id"=${req.params.productId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("product not available");
      }
      if (product.rows[0].ownerId !== user.userId) {
        return res
          .status(400)
          .send("you can not delete this product as you are not the owner");
      }
      await db.raw(`update "projectSE"."Product"
      SET hidden=true WHERE "id"=${req.params.productId}`);

      return res.status(200).send("product deleted successfully");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("couldn't delete product");
    }
  });
  //
  //customer
  //
  app.get("/api/v1/product/customer/view", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "customer") {
        return res.status(400).send("not an customer");
      }
      const products = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "hidden"=false ORDER BY id ASC `);
      return res.status(200).send(products.rows);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not view product");
    }
  });
  app.post("/api/v1/cart/new", async (req, res) => {
    try {
      let user = await getUser(req);
      let userId = user.userId;
      if (user.role !== "customer") {
        return res.status(400).send("not an customer");
      }
      let { productId, quantity } = req.body;
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Product"
      WHERE "id"=${productId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("product not available");
      }
      await db.raw(
        `insert into "projectSE"."Cart"("productId",quantity,"userId") 
        values(${productId}, ${quantity}, ${userId});`
      );
      return res.status(200).send("product created successfully");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not add product");
    }
  });
  app.get("/api/v1/cart/view", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "customer") {
        return res.status(400).send("not an customer");
      }
      productCart =
        await db.raw(`SELECT c.id as "cartId",c."productId" as "productId",p.name as "productName",c.quantity 
      FROM "projectSE"."Cart" as c 
      INNER join "projectSE"."Product" as p on c."productId"=p.id
      where c."userId"=${user.id}
      order BY "cartId" ASC `);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Cart"
      WHERE "userId"=${user.id}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("cart is empty");
      }
      return res.status(200).send(productCart.rows);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not view product");
    }
  });
  app.delete("/api/v1/cart/delete/:cartId", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "customer") {
        return res.status(400).send("not a customer");
      }
      const cart = await db.raw(`SELECT * FROM "projectSE"."Cart"
      WHERE "id"=${req.params.cartId}`);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Cart"
      WHERE "id"=${req.params.cartId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("cart not available");
      }
      if (cart.rows[0].userId !== user.userId) {
        return res
          .status(400)
          .send("you can not delete this cart as you are not the owner");
      }
      await db.raw(`DELETE FROM "projectSE"."Cart"
      WHERE "id"=${req.params.cartId};`);

      return res.status(200).send("successfully deleted");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("couldn't delete cart");
    }
  });
  app.put("/api/v1/cart/edit/:cartId", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "customer") {
        return res.status(400).send("not an customer");
      }
      const cart = await db.raw(`SELECT * FROM "projectSE"."Cart"
      WHERE "id"=${req.params.cartId}`);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Cart"
      WHERE "id"=${req.params.cartId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("cart not available");
      }
      if (cart.rows[0].userId !== user.userId) {
        return res
          .status(400)
          .send("you can not edit this cart as you are not the owner");
      }
      let quantity = req.body.quantity;
      await db.raw(`update "projectSE"."Cart"
      SET quantity=${quantity}
	  WHERE "id"=${req.params.cartId}`);
      return res.status(200).send("cart updated successfully");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("couldn't edit cart");
    }
  });
  app.post("/api/v1/order/new", async (req, res) => {
    try {
      let user = await getUser(req);
      if (user.role !== "customer") {
        return res.status(400).send("not an customer");
      }
      const cart = await db.raw(`SELECT * FROM "projectSE"."Cart"
      WHERE "userId"=${user.userId}`);
      let Count = await db.raw(`SELECT COUNT(*) FROM "projectSE"."Cart"
      WHERE "userId"=${user.userId}`);
      if (Count.rows[0].count < 1) {
        return res.status(400).send("cart not available");
      }
      await db.raw(
        `insert into "projectSE"."Order"("userId") 
        values(${user.userId});`
      );
      for (i = 0; i < cart.rows.length; i++) {
        let product = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "id"=${cart.rows[i].productId}`);
        if (product.rows[0].quantity < cart.rows[i].quantity) {
          return res
            .status(400)
            .send(`unsuccessfully purchase ${product.rows[0].name}`);
        }
      }
      for (i = 0; i < cart.rows.length; i++) {
        let product = await db.raw(`SELECT * FROM "projectSE"."Product"
      WHERE "id"=${cart.rows[i].productId}`);
        await db.raw(`update "projectSE"."Product"
        SET quantity=${product.rows[0].quantity - cart.rows[i].quantity}
      WHERE "id"=${cart.rows[i].productId}`);
        await db.raw(`DELETE FROM "projectSE"."Cart"
      WHERE "productId"=${cart.rows[i].productId};`);
      }
      return res.status(200).send("successfully order");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("couldn't purchase cart");
    }
  });
}

module.exports = { handlePrivateBackendApi };
