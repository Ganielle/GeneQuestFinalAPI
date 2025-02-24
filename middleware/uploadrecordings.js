const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var recordingupload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        console.log(file.mimetype)
        if (file.mimetype == "audio/wav" || file.mimetype == "audio/wave" || file.mimetype == "audio/mp3" || "audio/mpeg"){
            callback(null, true);
        }else{
            console.log(file.mimetype)
            console.log('only wav & mp3 files supported')
            callback(new Error('Invalid file type'))
        }
    }
})

module.exports = recordingupload