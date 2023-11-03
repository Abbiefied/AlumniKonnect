const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination:', '/public/uploads/');
    cb(null, '/public/uploads'); //the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
