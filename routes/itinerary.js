const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// CRUD都要，也要登入

router.use((req, res, next) => {
  // if(req.session.admin && req.session.admin.account){
  //     next();
  // } else {
  //     res.status(403).send('請先登入');
  // }
  next();
});

// R 
router.get(["/api", "/api/list"], async (req, res) => {
  const [rows] = await db.query("SELECT * FROM `itinerary` WHERE 1");
  res.json(rows);
  //不做分頁
});

// C 資料寫死，要改寫成從前端來
router.get("/api/addlist", async (req, res) => {
  const member_sid = 11;
  // const list_number = 1; //改用current_timestamp()		
  const list_name = "test list 2";
  const day = 3;
  const date = "2022-12-01";
  const status = 1;
  const sql =
  "INSERT INTO `itinerary`(`member_sid`, `list_number`, `list_name`, `day`, `date`, `status`, `created_date`) VALUES (?, NOW(), ?, ?, ?, ?, NOW())"
  const [result] = await db.query(sql, [
    member_sid,
    // list_number,
    list_name,
    day,
    date,
    status
  ]);
  res.json(result);
});

module.exports = router;
