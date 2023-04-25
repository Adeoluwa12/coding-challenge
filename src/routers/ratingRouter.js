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



router
     .route('/')
     .post(creatRating)
     .get(getAllRatings)


router
     .route("/:id")

     .patch(updateRating)
     .delete(deleteRating);



router
     .route('/one-doctor')
     .post(getSingleDoctorRating);

   
router
     .route('/:id/review')
     .get(review)     
module.exports = router;