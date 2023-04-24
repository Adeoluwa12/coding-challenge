const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
     {
          sender: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
          },
          recipient: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
          },
          message: {
               type: String,
               required: true,
          },
          read: {
               type: Boolean,
               default: false,
          },
     },
     { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
