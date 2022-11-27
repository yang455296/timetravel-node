const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
// router.get("/api/signin", async (req, res) => {
//   const userID = "US21";
//   const username = "花枝"; 
//   const email = "eee@email.com"; 
//   const password_hash = "lasdkf39485349hflskdfsdklfsk"; 
  
//   const sql =

//   "INSERT INTO `member_information`(`userID`, `username`, `email`, `password_hash`, `login_time`,`creating_time`) VALUES ( ?, ?, ?, ?, NOW(), NOW())"
//   const [result] = await db.query(sql, [
//     userID,
//     username,
//     email,
//     password_hash
//   ]);
//   res.json(result);
// });
// router.post("/api/information", async (req, res) => {
//   // res.json(req.body);
//   const output = {
//     success: false,
//     code: 0,
//     error: {},
//     postData: req.body, //除錯用
//   };
//   const sql =
//   "SELECT * FROM `member_information"
//   const [result] = await db.query(sql, [
//     req.body.userID,
//     req.body.username,
//     req.body.email,
//     req.body.password_hash,
//   ]);

//   if (result.affectedRows) output.success = true;
//   res.json(output);
// });

// R 
router.get(["/api/memberlist"], async (req, res) => {
  const [rows] = await db.query("SELECT * FROM `member_information` WHERE 1");
  res.json(rows);
  //不做分頁
});

// Profile
router.put("/api/edit-member-api", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
    "UPDATE `member_information` SET `username` = ?, `telephone` = ? WHERE `sid` = ?";
  const [result] = await db.query(sql, [
    req.body.username,
    req.body.telephone,
    req.body.sid,
  ]);
  
  console.log(result);
  // if(result.affectedRows) output.success = true;
  if (result.changedRows) output.success = true;
  res.json(output);
});

// ResetPassword
router.post("/api/reset-password-member-api", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql1= "SELECT * FROM member_information WHERE sid=?";
  const [rows] = await db.query(sql1, [req.body.sid]);
  
  if(! rows.length){
      return res.json(output);
  }
  const row = rows[0];
  
  output.success = bcrypt.compareSync(req.body.oldPassword, row['password_hash']);
  
  if(output.success){
    output.error = '';
    const sql = 
    "UPDATE `member_information` SET `password_hash` = ? WHERE `sid` = ?";
    const [result] = await db.query(sql, [
      bcrypt.hashSync(req.body.newPassword,10),
      req.body.sid,
    ]);
    if (result.affectedRows) output.success = true;
} else{
  //return ("舊密碼錯誤")
}
    res.json(output);
  });


// signin
router.post("/api/signin-api", async (req, res) => {
  // res.json(req.body);
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
  "INSERT INTO `member_information`(`username`, `email`, `password_hash`) VALUES (?, ?, ?)"
  const [result] = await db.query(sql, [
    req.body.username,
    req.body.email,
    bcrypt.hashSync(req.body.password,10),
    
  ]);
  //console.log(req.body.password);

  if (result.affectedRows) output.success = true;
  res.json(output);
});


//login
router.post('/api/login-api', async (req, res)=>{
  const output = {
      success: false,
      error: '帳密錯誤',
      postData: req.body, // 除錯用
      auth: {}
  };
  //console.log(req.body);
  const sql = "SELECT * FROM member_information WHERE email=?";
  const [rows] = await db.query(sql, [req.body.email]);
  
  if(! rows.length){
      return res.json(output);
  }
  const row = rows[0];
  
  output.success = bcrypt.compareSync(req.body.password, row['password_hash']);
  
  if(output.success){
      output.error = '';
      const {sid, email} = row;
      const token = jwt.sign({sid, email}, process.env.JWT_SECRET);
      output.auth = {
          sid,
          email,
          token
      }
  } 
  //console.log(output)
  res.json(output);
});

// // R 
// router.get(["/api/item/:list_number"], async (req, res) => {
//   const sql = "SELECT * FROM `itinerary_detail` WHERE list_number=? ";
//   const [result] = await db.query(sql, [req.params.list_number]); 
//   res.json(result);
//   //不做分頁
// });

// // U
// router.put("/api/edititem/:list_number", async (req, res) => {
//   const output = {
//     success: false,
//     code: 0,
//     error: {},
//     postData: req.body, //除錯用
//   };
//   const sql =
//     "UPDATE `itinerary_detail` SET `day` = ?, `sequence` = ?, `category` = ?, `category_id` = ?, `time` = ? WHERE `sid`= ?"; 
//   const [result] = await db.query(sql, [
//     req.body.day,
//     req.body.sequence,
//     req.body.category,
//     req.body.category_id,
//     req.body.time,
//     req.body.sid,
//   ]);

//   // console.log(result);
//   // if(result.affectedRows) output.success = true;
//   if (result.changedRows) output.success = true;
//   res.json(output);
// });


module.exports = router;