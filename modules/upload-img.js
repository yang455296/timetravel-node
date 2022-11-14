const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
};

// 檢查上傳檔案類型是否在extMap
const fileFilter = (req, file, callback) => {
    callback(null, !!extMap[file.mimetype])
}; 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../public/uploads') //儲存路徑
    },
    filename: (req, file, cb) => {
        const ext = extMap[file.mimetype]; //副檔名
        cb(null, uuidv4() + ext); //檔名
    } 
});

module.exports = multer({storage, fileFilter});