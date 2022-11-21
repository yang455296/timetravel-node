const express = require("express");
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
  if (totalRows > 0) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return res.redirect(`?page=${totalPages}`);
    }
    const sql = `SELECT * FROM hotel 
    JOIN hotel_categories ON hotel.categories_sid=hotel_categories.hotel_categories_sid 
    JOIN area ON hotel.area_sid=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid ${where} ORDER BY sid LIMIT ${
      (page - 1) * perPage
    }, ${perPage} `;
    [rows] = await db.query(sql);
  }
  return {
    totalRows,
    totalPages,
    perPage,
    page,
    rows,
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


router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getListData(req, res));
});

module.exports = router;
