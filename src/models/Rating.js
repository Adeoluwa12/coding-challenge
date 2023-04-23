const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provided rating"],
    },
    title: {
      type: String,
      required: [true, "Please provide rating title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provied the comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avg: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


RatingSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.user);
});

RatingSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.user);
});

module.exports  = mongoose.model("Rating", RatingSchema);

