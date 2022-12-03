const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// 專用處理sql字串的工具，主要format與escape
const SqlString = require('sqlstring')
// CRUD只要R，不需要登入
router.use((req, res, next) => {
  next();
});



async function getAllListData(req, res) {
  let where = ` WHERE 1 `;
  
  const food_t_sql = `SELECT COUNT(1) totalRows FROM food_product_all ${where}`;
  const site_t_sql = `SELECT COUNT(1) totalRows FROM site ${where}`;
  const hotel_t_sql = `SELECT COUNT(1) totalRows FROM hotel ${where}`;
  const ticket_t_sql = `SELECT COUNT(1) totalRows FROM tickets ${where}`;


  // 分頁功能
  const [foodTotalRows]= await db.query(food_t_sql)
  const [siteTotalRows] = await db.query(site_t_sql);
  const [hotelTotalRows]= await db.query(hotel_t_sql);
  const [ticketTotalRows]= await db.query(ticket_t_sql);

  // //算出總筆數
   const allTotalRows = foodTotalRows[0].totalRows+hotelTotalRows[0].totalRows+siteTotalRows[0].totalRows+ticketTotalRows[0].totalRows
   console.log([[{allTotalRows}]])
 

  let allRows = []
  let foodRows=[];
  let siteRows=[];
  let hotelRows=[];
  let ticketRows=[];

  if (allTotalRows > 0) {
    // //算出總頁數＝總筆數/分頁
    // allTotalPages = Math.ceil(allTotalRows / perPage);
    // if (page > allTotalPages) {
    //   return res.redirect(`?page=${allTotalPages}`);
    // }
    const foodsql = `SELECT * FROM food_product_all 
    JOIN food_categories ON food_product_all.categories_sid=food_categories.categories_sid
    JOIN area ON food_product_all.area_sid=area.area_sid 
    JOIN city ON food_product_all.city_sid=city.city_sid
    ORDER BY sid  `;
    

    const sitesql = `SELECT * FROM site 
    JOIN site_categories ON site.site_category_sid=site_categories.site_category_sid 
    JOIN area ON site.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid 
    ORDER BY sid `;


    const hotelsql = `SELECT * FROM hotel 
    JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
    JOIN area ON hotel.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid
    ORDER BY sid `;


    const ticketsql = `SELECT * FROM tickets 
    JOIN tickets_categories ON tickets.categories_id=tickets_categories.id
    JOIN area ON tickets.cities_id=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid ${where} ORDER BY sid DESC  `;
    

    [foodRows] = await db.query(foodsql);
    [siteRows] = await db.query(sitesql);
    [hotelRows] = await db.query(hotelsql);
    [ticketRows] = await db.query(ticketsql);
    allRows = foodRows.concat(siteRows,hotelRows,ticketRows)
  }
  //分頁從前端處理
  return allRows
}


//取得美食收藏資料
router.get(["/foodCollect/:member_sid"], async (req, res) => {
  const [rows] = await db.query("SELECT food_product_sid FROM `member_food_collect` ",[req.params.food_product_sid]);
  res.json(rows);
});
//新增美食收藏
router.post("/foodAddCollect", async (req, res) => {
  res.json(req.body);
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql = "INSERT INTO `member_food_collect`(`member_sid`, `food_product_sid` ) VALUES (?, ?)"
  const [result] = await db.query(sql, [
    req.body.member_sid,
    req.body.food_product_sid,
  ]);

  if (result.affectedRows) output.success = true;
  res.json(output);
});


// 移除美食收藏
router.delete("/foodDelCollect", async (req, res) => {
  const sql = "DELETE FROM member_food_collect WHERE food_product_sid=''";
  const [result] = await db.query(sql, [req.params.food_product_sid]);
  res.json({ success: !!result.affectedRows, result });
});


//取得美食訂單資料
router.get("/order/:sid", async (req, res) => {
  const sql = "SELECT * FROM `orders_details_food` WHERE sid=? ";
  const [result] = await db.query(sql, [req.params.sid]);
  res.json({ success: !!result.affectedRows, result });
});





//取得所有商品資料
router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getAllListData(req, res));
});



module.exports = router;
