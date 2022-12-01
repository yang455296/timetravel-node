const express = require("express");
const { filter } = require("lodash");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// CRUD只要R，不需要登入
router.use((req, res, next) => {
  next();
});

async function getListData(req, res) {
  const perPage = 12;
  let page = +req.query.page || 1;
  if (page < 1) {
    return res.redirect(req.baseUrl); // api不應該轉向
  }
  // 搜尋功能
  let search = req.query.search ? req.query.search.trim() : "";
  let where = ` WHERE 1 `;
  if (search) {
    where += ` AND 
        (
            \`name\` LIKE ${db.escape("%" + search + "%")}
            OR
            \`description\` LIKE ${db.escape("%" + search + "%")}
        ) `;
  }
  const t_sql = `SELECT COUNT(1) totalRows FROM site ${where}`;
  // 分頁功能
  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0;
  let rows = [];
  let rowsAll = [];
  let filterRow = []
  if (totalRows > 0) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return res.redirect(`?page=${totalPages}`);
    }
    // const sql = `SELECT * FROM hotel 
    // JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
    // JOIN area ON hotel.area_sid=area.area_sid 
    // JOIN city ON area.city_sid=city.city_sid ${where} ORDER BY sid LIMIT ${
    //   (page - 1) * perPage
    // }, ${perPage} `;
    const sql = `SELECT * FROM hotel 
    JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
    JOIN area ON hotel.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid
    JOIN hotel_room on hotel_room.product_number = hotel.product_number
    ${where} GROUP BY hotel.product_number  LIMIT ${
      (page - 1) * perPage
    }, ${perPage} `;

    const sqlAll = `SELECT * FROM hotel 
    JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
    JOIN area ON hotel.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid 
    JOIN hotel_room on hotel_room.product_number = hotel.product_number
    ${where} GROUP BY hotel.product_number `;

    const sqlFilter = `SELECT hotel.product_name ,area.area_name FROM hotel 
    JOIN area on area.area_sid = hotel.area_sid
    UNION 
    SELECT food_product_all.product_name,area.area_name FROM food_product_all
    JOIN area on area.area_sid = food_product_all.area_sid
    UNION
    SELECT site.name,area.area_name FROM site
    JOIN area on area.area_sid = site.area_sid
    UNION
    SELECT tickets.product_name ,area.area_name FROM tickets
    JOIN city on city.city_sid = tickets.cities_id
    JOIN area on area.city_sid = city.city_sid`;

    [rows] = await db.query(sql);
    [rowsAll] = await db.query(sqlAll);
    // [filterRow] = await db.query(sqlFilter);
  }
  return {
    totalRows,
    totalPages,
    perPage,
    page,
    rows,
    rowsAll,
    // filterRow,
    search,
    query: req.query,
  };
}

// R
router.get("/item/:sid", async (req, res) => {
  const sql = `SELECT * FROM hotel
  JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
  JOIN area ON hotel.area_sid=area.area_sid 
  JOIN city ON area.city_sid=city.city_sid
  WHERE sid=?
  `;
  const [data] = await db.query(sql, [req.params.sid]);
  res.json(data[0]);
}); //單筆資料http://localhost:3001/site/item/12

router.get('/item/:sid/room',async(req,res)=>{
  // const sql = `SELECT * FROM hotel
  // JOIN hotel_room on hotel.product_number = hotel_room.product_number
  // where hotel.sid = ?`;
  const sql = `SELECT hotel_room.room_type,hotel_room.room_price,hotel_room.room_picture FROM hotel_room
  JOIN hotel on hotel.product_number = hotel_room.product_number
where hotel.sid = ?`
  const [data] = await db.query(sql,[req.params.sid])
  // res.json(data.length)
  res.json(data)
})

router.get('/item/:sid/hotelComment',async(req,res)=>{
  // const sql = `SELECT * FROM hotel
  // JOIN hotel_room on hotel.product_number = hotel_room.product_number
  // where hotel.sid = ?`;
  const sql = `SELECT member_information.username,commit_hotel.commit_text,commit_hotel.score,commit_hotel.create_time FROM commit_hotel
  JOIN hotel on hotel.product_number = commit_hotel.product_number
	JOIN member_information on member_information.sid = commit_hotel.userID
    where hotel.sid = ? ORDER BY commit_hotel.create_time 
`
  const [data] = await db.query(sql,[req.params.sid])
  // res.json(data.length)
  res.json(data)
})



router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getListData(req, res));
});

module.exports = router;
