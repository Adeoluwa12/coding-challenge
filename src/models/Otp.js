const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    otp: {
      type: String,
      required: true,
    },
    otp_expires_at: {
      required: false,
      type: Date,
    },
    otp_token: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 600 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);
