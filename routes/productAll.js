const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// 專用處理sql字串的工具，主要format與escape
const SqlString = require('sqlstring')
// CRUD只要R，不需要登入
router.use((req, res, next) => {
  next();
});




async function getList(req, res) {
  const perPage = 12;
  let page = +req.query.page || 1;
  if (page < 1) {
    return res.redirect(req.baseUrl); // api不應該轉向
  }
  // 搜尋功能
  // let search = req.query.search ? req.query.search.trim() : "";
  // let where = ` WHERE 1 `;
  // if (search) {
  //   where += ` AND 
  //       (
  //           \`product_name\` LIKE ${db.escape("%" + search + "%")}
  //           OR
  //           \`applicable_store\` LIKE ${db.escape("%" + search + "%")}
  //       ) `;
  // }
  const t_sql = `SELECT COUNT(1) totalRows FROM product WHERE 1`;
  // 分頁功能
  const [[{ totalRows }]] = await db.query(t_sql);
  // let totalPages = 0;
  let rows = [];
  if (totalRows > 0) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return res.redirect(`?page=${totalPages}`);
    }
    const sql = `SELECT * FROM product 
    LEFT JOIN member_all_collect ON member_all_collect.product_sid=product.sid
    JOIN area ON area.area_sid=product.area_sid
    JOIN city ON city.city_sid=area.city_sid
    ORDER BY product.sid  `;
     [rows] = await db.query(sql);
 
  }
  return    rows

}

//查看詳細頁是否收藏
router.get('/checkCollect/:sid', async(req,res)=>{
  const sql = `SELECT collect_product_name FROM member_all_collect WHERE member_sid = ?`
  const [data] = await db.query(sql,[req.params.sid])
  res.json(data.map((v,i)=>{
    return v.collect_product_name
  }))
})




//新增收藏
router.post("/AddCollect", async (req, res) => {

  
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql = "INSERT INTO `member_all_collect`(`member_sid`,`product_sid`,`collect_product_name` ) VALUES (?,?, ?)"
  const [result] = await db.query(sql, [
    req.body.member_sid,
    req.body.product_sid,
    req.body.collect_product_name,
  ]);

  if (result.affectedRows) output.success = true;
  res.json(req.body);
  // res.end(output);

});
//

// 移除收藏
router.post("/DelCollect", async (req, res) => {
  const sql = "DELETE FROM member_all_collect WHERE member_sid = ? AND product_sid = ? AND collect_product_name = ? ";
  const [result] = await db.query(sql, [
      req.body.member_sid,
      req.body.product_sid,
      req.body.collect_product_name
    ]);
  res.json({ success: !!result.affectedRows, result });
});


// //取得美食訂單資料
router.get("/order/:sid", async (req, res) => {
  const sql = "SELECT * FROM `orders_details_food` WHERE sid=? ";
  const [result] = await db.query(sql, [req.params.sid]);
  res.json({ success: !!result.affectedRows, result });
});





//取得所有商品資料
router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getList(req, res));
});



module.exports = router;
