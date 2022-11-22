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

// 列表CRUD+細節CRUD
// C 資料寫死，要改寫成從前端來
// router.get("/api/addlist", async (req, res) => {
//   const member_sid = 12;
//   const list_number = 4; 	
//   const list_name = "test list 21";
//   const day = 3;
//   const date = "2022-12-01";
//   const status = 1;
//   const sql =
//   "INSERT INTO `itinerary`(`member_sid`, `list_number`, `list_name`, `day`, `date`, `status`, `created_date`) VALUES (?, ?, ?, ?, ?, ?, NOW())"
//   const [result] = await db.query(sql, [
//     member_sid,
//     list_number,
//     list_name,
//     day,
//     date,
//     status
//   ]);
//   res.json(result);
// });
router.post("/api/addlist", async (req, res) => {
  // res.json(req.body);
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
  "INSERT INTO `itinerary`(`member_sid`, `list_number`, `list_name`, `day`, `date`, `status`, `created_date`) VALUES (?, ?, ?, ?, ?, ?, NOW())"
  const [result] = await db.query(sql, [
    req.body.member_sid,
    req.body.list_number,
    req.body.list_name,
    req.body.day || 1,
    req.body.date,
    req.body.status,
  ]);

  if (result.affectedRows) output.success = true;
  res.json(output);
});

// R 
router.get(["/api/list"], async (req, res) => {
  const [rows] = await db.query("SELECT * FROM `itinerary` WHERE 1");
  res.json(rows);
  //不做分頁
});

// U
router.put("/api/editlist/:sid", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
    "UPDATE `itinerary` SET `list_name` = ?, `day` = ?, `date` = ? WHERE `sid` = ?";
  const [result] = await db.query(sql, [
    req.body.list_name,
    req.body.day,
    req.body.date,
    req.body.sid,
  ]);

  // console.log(result);
  // if(result.affectedRows) output.success = true;
  if (result.changedRows) output.success = true;
  res.json(output);
});
// D
router.delete("/api/dellist/:sid", async (req, res) => {
  const sql = "DELETE FROM itinerary WHERE sid=? ";
  const [result] = await db.query(sql, [req.params.sid]);
  res.json({ success: !!result.affectedRows, result });
});

// C
router.post("/api/additem", async (req, res) => {
  // res.json(req.body);
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
  "INSERT INTO `itinerary_detail`(`list_number`, `day`, `sequence`, `category`, `category_id`, `time`, `created_date`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
  const [result] = await db.query(sql, [
    req.body.list_number,
    req.body.day,
    req.body.sequence,
    req.body.category,
    req.body.category_id,
    req.body.time,
  ]);

  if (result.affectedRows) output.success = true;
  res.json(output);
});

// R 
router.get(["/api/item/:list_number"], async (req, res) => {
  const sql = "SELECT * FROM `itinerary_detail` WHERE list_number=? ";
  const [result] = await db.query(sql, [req.params.list_number]); //TODO
  res.json(result);
  //不做分頁
});

// U
router.put("/api/edititem/:list_number", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
    "UPDATE `itinerary_detail` SET `day` = ?, `sequence` = ?, `category` = ?, `category_id` = ?, `time` = ? WHERE `sid`= ?"; //TODO
  const [result] = await db.query(sql, [
    req.body.day,
    req.body.sequence,
    req.body.category,
    req.body.category_id,
    req.body.time,
    req.body.sid,
  ]);

  // console.log(result);
  // if(result.affectedRows) output.success = true;
  if (result.changedRows) output.success = true;
  res.json(output);
});

// D
router.delete("/api/delitem/:sid", async (req, res) => {
  const sql = "DELETE FROM itinerary_detail WHERE sid=? ";
  const [result] = await db.query(sql, [req.params.sid]);
  res.json({ success: !!result.affectedRows, result });
});

module.exports = router;
