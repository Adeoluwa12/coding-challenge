const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const {
     getOneUser,
     getAllUsers,
     updateImage,
     updateUser,
     deleteUser
} = require('../controllers/userController')





const storage = multer.diskStorage({



});

const fileFilter = (req, file, cb) => {
     let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"]
     if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new CustomError("Please provide a valid image file", 400), false)
     }

     return cb(null, true);

};


const upload = multer({ storage, fileFilter, fileSize: 1024 * 1024 * 5 })

router
     .route('/')
     .get(getAllUsers)


router
     .route('/:id')
     .get(getOneUser)
     .patch(updateUser)
     .delete(deleteUser)


router
     .patch("/:id/image", upload.single('image'), updateImage)





module.exports = router;