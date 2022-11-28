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
            \`product_name\` LIKE ${db.escape("%" + search + "%")}
            OR
            \`applicable_store\` LIKE ${db.escape("%" + search + "%")}
        ) `;
  }
  const t_sql = `SELECT COUNT(1) totalRows FROM food_product_all ${where}`;
  // 分頁功能
  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0;
  let rows = [];
  if (totalRows > 0) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return res.redirect(`?page=${totalPages}`);
    }
    const sql = `SELECT * FROM food_product_all 
    JOIN food_categories ON food_product_all.categories_sid=food_categories.categories_sid
    JOIN area ON food_product_all.area_sid=area.area_sid 
    JOIN city ON food_product_all.city_sid=city.city_sid ${where} ORDER BY sid DESC LIMIT ${
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
//取得評論的資料
async function getCommitData(req, res) {

  let rows = [];
    const sql = `SELECT * FROM commit_food JOIN member_information ON commit_food.userID=member_information.sid `;
    [rows] = await db.query(sql);
  return rows
}

router.get(["/commit", "/food/detail/commit"], async (req, res) => {
  res.json(await getCommitData(req, res));
});

// R
router.get("/item/:sid", async (req, res) => {
  const sql = "SELECT * FROM food_product_all JOIN food_categories ON food_product_all.categories_sid=food_categories.categories_sid JOIN area ON food_product_all.area_sid=area.area_sid JOIN city ON food_product_all.city_sid=city.city_sid WHERE sid=?"
  // const sql = "SELECT * FROM food_product_all WHERE sid=? ";
  const [data] = await db.query(sql, [req.params.sid]);
  res.json(data[0]);
}); //單筆資料http://localhost:3001/site/item/12


router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getListData(req, res));
});


module.exports = router;
