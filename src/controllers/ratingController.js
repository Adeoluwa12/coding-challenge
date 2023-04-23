const Rating = require("../models/Rating");
const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");




const creatRating = async (req, res) => {
     const { doctor: doctor } = req.body;

     isValidDoctor = await User.findOne({ _id: doctor });

     if (!isValidDoctor) throw new CustomError.NotFoundError(`No Doctor with id: ${isValidDoctor}`)


     const alreadySumited = await Rating.findOne({
          doctor: doctor,
          user: req.body.user
     })

     if (alreadySumited) {
          throw new CustomError.BadRequestError(
               "Already submitted rating for this doctor"
          );
     }

     const rating = await Rating.create(req.body);
     res.status(StatusCodes.CREATED).json({ rating })


}


const getAllRatings = async (req, res) => {
     const ratings = await Rating.find({}).populate({
          path: "doctor",
          select: "image",
     });
     res.status(StatusCodes.OK).json({
          ratings,
          count: ratings.length,
     });
}


const updateRating = async (req, res) => {
     const { id: ratingId } = req.params;
     const { rating, title, comment } = req.body;

     const newRating = await Rating.findOne({ _id: ratingId });

     if (!newRating) {
          throw new CustomError.NotFoundError(`No newRating with id: ${newRating}`);
     }

     newRating.rating = rating;


     await newRating.save();
     res.status(StatusCodes.OK).json({ newRating });
};



const deleteRating = async (req, res) => {
     const { id: ratingId } = req.params;

     const rating = await Rating.findOne({ _id: ratingId });

     if (!rating) {
          throw new CustomError.NotFoundError(`No rating with id: ${ratingId}`);
     }


     await rating.remove();
     res.status(StatusCodes.OK).json({
          messge: "Succesfully delete rating",
     });
};


const getSingleDriverRating = async (req, res) => {
     const { doctor } = req.body;

     const doctorId = await Rating.find({ doctor });

     if (!doctorId || doctorId.length === 0) {
          throw new CustomError.NotFoundError(`No ratings found for doctor with ID: ${doctor}`);
     }

     const result = doctorId
          .filter((doctorrate) => doctorrate.rating >= 0)
          .reduce((a, b) => a + b.rating / doctorId.length, 0);

     const updatedRating = await Rating.findByIdAndUpdate(
          doctorId[0]._id,
          { $set: { avg: result } },
          { new: true }
     );

     if (!updatedRating) {
          throw new CustomError.InternalServerError(`Failed to update rating for doctor with ID: ${doctor}`);
     }

     console.log(result);
     res.status(StatusCodes.OK).json({
          message: `Rating updated successfully`,
          data: result,
     });
};




const review = async (req, res) => {

     const { id: doctor } = req.params;

     const numReviews = await Rating.countDocuments({ doctor });

     res.status(StatusCodes.OK).json({
          numReviews
     })
}

module.exports = {
     creatRating,
     getAllRatings,
     review,
     updateRating,
     deleteRating,
     getSingleDriverRating,
}