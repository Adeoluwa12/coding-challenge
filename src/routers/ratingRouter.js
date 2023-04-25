const express = require('express')
const router = express.Router();




const {
     creatRating,
     getAllRatings,
     review,
     updateRating,
     deleteRating,
     getSingleDoctorRating
} = require('../controllers/ratingController')

const {
     verifyToken,
     verifyTokenAndAuthorization,
     verifyTokenAndAdmin,

} = require('../middleware/jwt_helper')

const {
     authenticateUser,
     authorizePermissions,
} = require('../middleware/authentication')

router
     .route('/')
     .post(verifyToken, creatRating)
     .get(verifyToken, getAllRatings)


router
     .route("/:id")

     .patch(verifyToken, updateRating)
     .delete(verifyToken, deleteRating);



router
     .route('/one-doctor')
     .post(verifyToken, getSingleDoctorRating);


router
     .route('/:id/review')
     .get(verifyToken, review)


     
module.exports = router;