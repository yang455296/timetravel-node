!! 如果不熟悉Node請不要修改index.js裡的東西，刪除請使用註解，
    index.js 裡的routes要使用記得取消註解、註解其他人的部分，
    可以先複製\routes裡的檔案來修改成自己的API進行測試
    \routes\site.js 
        list的R 有:分頁、搜尋 缺:篩選
        detail的R 有
    \routes\itinerary.js 
        list的C 目前寫死
        list的R 有
        list的U 缺:all
        list的D 缺:all
        detail的 CRUD 缺:all

-----------------------------

環境設定 10/6, 7
    啟動node 
        npm start (修改後要重開node)
        nodemon start
        npx nodemon start (nodemon裝在區域)
        npm run dev

------------------------------

Postman
2022-10-11 11-12-23.mp4 GET 
2022-10-11 14-37-27.mp4 POST 

------------------------------

routes CRUD
    C: POST
    R: GET
    U: PUT全部 (PATCH一項)
    D: DELETE

------------------------------

/public 這裡應該要是空的
/public/imgs 放照片
/public/uploads 放上傳照片
/data 這裡應該要是空的 放測試用資料(寫死)

------------------------------

Multer 檔案上傳 (user頭像)
2022-10-12 09-06-57.mp4 原始
2022-10-12 10-09-46.mp4 模組化+uuid
\modules\upload-img.js

------------------------------

Router
2022-10-13 10-16-30.mp4 13:35

------------------------------

req.query  # query string
req.body   # 通常是表單資料
req.file #上傳
req.files
req.params # 路徑的參數

------------------------------

登入
2022-10-14 10-04-35.mp4
react不要用session做登入 20:30

------------------------------

連資料庫
2022-10-14 11-12-13.mp4
session進資料庫 (建議會員/購物車/任何有資料要進資料庫的人再看一遍)
2022-10-14 13-32-24.mp4
可以先參考\routes\itinerary.js router.get("/addlist", ...)

------------------------------

URLSearchParams USP: 解析query string
2022-10-17 11-12-45.mp4

------------------------------

API設計 
2022-10-17 11-12-45.mp4 18:30

------------------------------

前端搜尋功能 老師上課\nodejs\public\ab-list.html
2022-10-17 14-38-12.mp4
更新網址 不刷頁面
2022-10-17 14-38-12.mp4 14:00
換頁 不刷頁面
2022-10-17 15-39-22.mp4
