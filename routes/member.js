const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const upload = require(__dirname + "/../modules/upload-img");

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
// --------R---------取得會員資料
router.get(["/api/memberlist"], async (req, res) => {
  const [rows] = await db.query("SELECT * FROM `member_information` WHERE 1");
  res.json(rows);
  //不做分頁
});
// --------R---------取得會員評論
// --------美食-----------
router.get(["/:sid/comment"], async (req, res) => {
  const food_sql = "SELECT `product_number`, `product_name`,`commit_text`,`score`,`create_time`FROM commit_food JOIN `member_information` ON commit_food.userID=member_information.sid WHERE member_information.sid=?";
  const stay_sql = "SELECT `product_number`, `product_name`,`commit_text`,`score`,`create_time`FROM commit_hotel JOIN `member_information` ON commit_hotel.userID=member_information.sid WHERE member_information.sid=?";
  const ticket_sql = "SELECT `product_number`,`product_name`,`commit_text`,`score`,`create_time`FROM commit_tickets JOIN `member_information` ON commit_tickets.userID=member_information.sid WHERE member_information.sid=?";

  const data = await Promise.all([
    db.query(food_sql, [req.params.sid]),
    db.query(stay_sql, [req.params.sid]),
    db.query(ticket_sql, [req.params.sid]),
  ])

  const result = [[] , [], []]
  data.forEach((item, index) => {
    const [first, sec] = item;
    result[index] = result[index].concat(first);
  })
  
  // res.json([]);
  // const data = await db.query(sql, [req.params.sid]);
  // console.log(data)
  res.json(result);
});
// // --------住宿-----------
// router.get(["/api/comment/stay/:sid"], async (req, res) => {
//   const sql = "SELECT commit_hotel.sid as `sid`, `product_name`,`commit_text`,`score`,`create_time`FROM commit_hotel JOIN `member_information` ON commit_hotel.userID=member_information.sid WHERE member_information.sid=?";
//   const [data] = await db.query(sql, [req.params.sid]);
//   res.json(data[0]);
// });
// // --------票卷-----------
// router.get(["/api/comment/tickets/:sid"], async (req, res) => {
//   const sql = "SELECT commit_tickets.sid as `sid`,`product_name`,`commit_text`,`score`,`create_time`FROM commit_tickets JOIN `member_information` ON commit_tickets.userID=member_information.sid WHERE member_information.sid=?";
//   const [data] = await db.query(sql, [req.params.sid]);
//   res.json(data[0]);
// });
// -------Commit--------會員編輯評論api
// --------美食-----------
router.put("/:sid/:product_number/edi-comment", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const edit_food_sql =
    "UPDATE `commit_food` SET `commit_text` = ?, `create_time` = NOW() WHERE `product_number` = ?";
  const edit_stay_sql =
    "UPDATE `commit_hotel` SET `commit_text` = ?, `create_time` = NOW() WHERE `product_number` = ?";
  const edit_tickets_sql =
    "UPDATE `commit_tickets` SET `commit_text` = ?, `create_time` = NOW() WHERE `product_number` = ?";

  const data = await Promise.all([
    db.query(edit_food_sql, [
      req.body.commit_text,
      req.params.product_number
    ]),
    db.query(edit_stay_sql, [
      req.body.commit_text,
      req.params.product_number
    ]),
    db.query(edit_tickets_sql, [
      req.body.commit_text,
      req.params.product_number
    ]),
  ])
  const result = [[] , [], []]

  data.forEach((item, index) => {
    const [first, sec] = item;
    result[index] = result[index].concat(first);
  })
  
  console.log(result);
  // if(result.affectedRows) output.success = true;
  if (result.changedRows) output.success = true;
  res.json(output);
});
// --------住宿-----------
router.put("/api/edit-comment/stay/:sid", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
    "UPDATE `commit_hotel` SET `commit_text` = ?, `create_time` = NOW() WHERE `sid` = ?";
  const [result] = await db.query(sql, [
    req.body.commit_text,
    req.body.sid,
  ]);
  
  console.log(result);
  // if(result.affectedRows) output.success = true;
  if (result.changedRows) output.success = true;
  res.json(output);
});
// --------票卷-----------
router.put("/api/edit-comment/tickets/:sid", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  const sql =
    "UPDATE `commit_tickets` SET `commit_text` = ?, `create_time` = NOW() WHERE `sid` = ?";
  const [result] = await db.query(sql, [
    req.body.commit_text,
    req.body.sid,
  ]);
  
  console.log(result);
  // if(result.affectedRows) output.success = true;
  if (result.changedRows) output.success = true;
  res.json(output);
});
//--------刪除會員評論----------
// --------美食-----------
router.delete("/api/del-comment/food", async (req, res) => {
  const sql = "DELETE FROM commit_food WHERE sid=? ";
  const [result] = await db.query(sql, [req.body.sid]);
  res.json({ success: !!result.affectedRows, result });
});
// --------住宿-----------
router.delete("/api/del-comment/stay", async (req, res) => {
  const sql = "DELETE FROM commit_hotel WHERE sid=? ";
  const [result] = await db.query(sql, [req.params.sid]);
  res.json({ success: !!result.affectedRows, result });
});
// --------票卷-----------
router.delete("/api/del-comment/tickets", async (req, res) => {
  const sql = "DELETE FROM commit_tickets WHERE sid=? ";
  const [result] = await db.query(sql, [req.params.sid]);
  res.json({ success: !!result.affectedRows, result });
});
// -------Profile--------會員編輯api
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

// ---------會員大頭上傳api---------
router.post('/upload-avatar', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          //使用輸入框的名稱來獲取上傳檔案 (例如 "avatar")
          let avatar = req.files.avatar;
          
          //使用 mv() 方法來移動上傳檔案到要放置的目錄裡 (例如 "uploads")
          avatar.mv('./uploads/Member/' + avatar.name);
  
          //送出回應
          res.json({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: avatar.name,
                  mimetype: avatar.mimetype,
                  size: avatar.size
              }
          });
          const sql =
            "UPDATE `member_information` SET `member_img` = ? WHERE `sid` = ?";
          const [result] = await db.query(sql, [
              req.body.avatar,
              req.body.sid,
            ]);
            if (result.changedRows) output.success = true;
            res.json(output);
            //有錯誤
      }
  } catch (err) {
      res.status(500).json(err);
  }
  });

// ------------ResetPassword--------------重設密碼api
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
    output.error= '密碼不相同';
}
    res.json(output);
  });


// ---------------signin---------------註冊api
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


//---------------login----------------登入api
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