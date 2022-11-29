const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// CRUD只要R，不需要登入
router.use((req, res, next) => {
  next();
});
//TODO:商品名稱、商品縣市名、商品價錢、商品收藏數
async function getAllListData(req, res) {
  const perPage = 12;
    //當前的page＝搜尋的page如果不是就是第一頁
  let page = +req.query.page || 1;
  if (page < 1) {
    return res.redirect(req.baseUrl); // api不應該轉向
  }
  // 搜尋功能
//   let search = req.query.search ? req.query.search.trim() : "";
  let where = ` WHERE 1 `;
//   if (search) {
//     where += ` AND 
//         (
//             \`product_name\` LIKE ${db.escape("%" + search + "%")}
//             OR
//             \`applicable_store\` LIKE ${db.escape("%" + search + "%")}
//         ) `;
//   }
  const food_t_sql = `SELECT COUNT(1) totalRows FROM food_product_all ${where}`;
  const site_t_sql = `SELECT COUNT(1) totalRows FROM site ${where}`;
  const hotel_t_sql = `SELECT COUNT(1) totalRows FROM hotel ${where}`;
  const ticket_t_sql = `SELECT COUNT(1) totalRows FROM tickets ${where}`;


  // 分頁功能
  const [foodTotalRows ]= await db.query(food_t_sql)
  const [siteTotalRows] = await db.query(site_t_sql);
  const [hotelTotalRows] = await db.query(hotel_t_sql);
  const [ticketTotalRows] = await db.query(ticket_t_sql);
  const allTotalRows = foodTotalRows[0].totalRows + siteTotalRows[0].totalRows+hotelTotalRows[0].totalRows+ticketTotalRows[0].totalRows

  let allTotalPages = 0;
  let allRows = [];
  let foodRows=[];
  let siteRows=[];
  let hotelRows=[];
  let ticketRows=[];


  if (allTotalRows > 0) {
    allTotalPages = Math.ceil(allTotalRows / perPage);
    if (page > allTotalPages) {
      return res.redirect(`?page=${allTotalPages}`);
    }
    const foodsql = `SELECT * FROM food_product_all 
    JOIN food_categories ON food_product_all.categories_sid=food_categories.categories_sid
    JOIN area ON food_product_all.area_sid=area.area_sid 
    JOIN city ON food_product_all.city_sid=city.city_sid `;
    

    const sitesql = `SELECT * FROM site 
    JOIN site_categories ON site.site_category_sid=site_categories.site_category_sid 
    JOIN area ON site.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid `;


    const hotelsql = `SELECT * FROM hotel 
    JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
    JOIN area ON hotel.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid`;


    const ticketsql = `SELECT * FROM tickets 
    JOIN tickets_categories ON tickets.categories_id=tickets_categories.id
    JOIN area ON tickets.cities_id=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid`;
    

    [foodRows] = await db.query(foodsql);
    [siteRows] = await db.query(sitesql);
    [hotelRows] = await db.query(hotelsql);
    [ticketRows] = await db.query(ticketsql);
     allRows = foodRows.concat(siteRows).concat(hotelsql).concat(ticketsql);
     const allProduct = allRows;
  }
  return {
    allTotalRows,
    allTotalPages,
    perPage,
    page,
    allRows
    // query:req.query


   };
}



// R
router.get("/item/:sid", async (req, res) => {
  const sql = `SELECT * FROM food_product_all JOIN food_categories ON food_product_all.categories_sid=food_categories.categories_sid JOIN area ON food_product_all.area_sid=area.area_sid JOIN city ON food_product_all.city_sid=city.city_sid WHERE sid=?`
 // const sql = "SELECT * FROM food_product_all WHERE sid=? ";
  const [data] = await db.query(sql, [req.params.sid]);
  res.json(data[0]);
}); //單筆資料http://localhost:3001/site/item/12

// //取得評論的資料
// async function getCommitData(req, res) {

//   let rows = [];
//     const sql = `SELECT * FROM commit_food JOIN member_information ON commit_food.userID =member_information.sid `;
//     [rows] = await db.query(sql);
//   return rows
// }

// router.get(["/commit", "/food/detail/commit"], async (req, res) => {
//   res.json(await getCommitData(req, res));
// });






router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getAllListData(req, res));
});


module.exports = router;
