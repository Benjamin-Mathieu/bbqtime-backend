const multer = require('multer');
const path = require('path');

const upload = (file) => {
    if (file) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads/')
            },
            filename: function (req, file, cb) {
                console.log("File Object", file);
                let ext = '';
                if (file.originalname.split('.').length > 1) {
                    ext = path.extname(file.originalname);
                }
                console.log('ext', ext);
                cb(null, file.fieldname + '-' + Date.now() + ext)
            }
        })
        return multer({ storage: storage }).single(file);
    }
}
module.exports = {
    upload
}