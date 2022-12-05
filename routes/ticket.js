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
  const t_sql = `SELECT COUNT(1) totalRows FROM tickets ${where}`;
  // 分頁功能
  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0;
  let rows = [];
  let rowsAll = [];
  if (totalRows > 0) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return res.redirect(`?page=${totalPages}`);
    }
    const sql = `SELECT * FROM tickets 
    JOIN tickets_categories ON tickets.categories_id=tickets_categories.id
    JOIN area ON tickets.cities_id=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid
    JOIN tickets_types ON tickets_types.product_number = tickets.product_number
    ${where} ORDER BY tickets.sid DESC LIMIT ${
      (page - 1) * perPage
    }, ${perPage} `;

    const sqlAll = `SELECT * FROM tickets 
    JOIN tickets_categories ON tickets.categories_id=tickets_categories.id
    JOIN area ON tickets.cities_id=area.area_sid 
    JOIN city ON area.city_sid=city.city_sid
    JOIN tickets_types ON tickets_types.product_number = tickets.product_number
    ${where} GROUP BY tickets.sid DESC LIMIT ${
      (page - 1) * perPage
    }, ${perPage} `;

    [rows] = await db.query(sql);
    [rowsAll] = await db.query(sqlAll);

  // const [data] = await db.query(sql,[req.params.sid])
  // const [data] = await db.query(sql)
  // res.json(data.length)
  // res.json(data)
    
  }
  return {
    totalRows,
    totalPages,
    perPage,
    page,
    rows,
    rowsAll,
    search,
    query: req.query,
  };
}

// R
// 取商品資料大項
router.get("/item/:sid", async (req, res) => {
  const sql = `SELECT * FROM tickets 
  JOIN tickets_categories ON tickets.categories_id=tickets_categories.id
  JOIN area ON tickets.cities_id=area.area_sid 
  JOIN city ON area.city_sid=city.city_sid
  WHERE sid=?  `;

  const [data] = await db.query(sql, [req.params.sid]);
  res.json(data[0]);
}); //單筆資料http://localhost:3001/site/item/12


// 取票種價錢
router.get('/item/:sid/types',async(req,res)=>{
 
  const sql = `SELECT tickets_types.tickets_types,tickets_types.product_price,tickets_types FROM tickets_types
  JOIN tickets on tickets.product_number = tickets_types.product_number
  where tickets.sid= ?`

  const [data] = await db.query(sql,[req.params.sid])
  // res.json(data.length)
  res.json(data)
})



// 取評論
router.get('/item/:sid/ticketComment',async(req,res)=>{

  const sql = `SELECT member_information.username,commit_tickets.commit_text,commit_tickets.score,commit_tickets.create_time FROM commit_tickets
  JOIN tickets on tickets.product_number = commit_tickets.product_number
	JOIN member_information on member_information.sid = commit_tickets.userID
    where tickets.sid = ?
`
  const [data] = await db.query(sql,[req.params.sid])
  // res.json(data.length)
  res.json(data)
})



router.get(["/api", "/api/list"], async (req, res) => {
  res.json(await getListData(req, res));
});

module.exports = router;
