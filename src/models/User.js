const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const { ACCOUNT_TYPES } = require('../constant/index')
const jwt = require('jsonwebtoken');



const UserSchema = new mongoose.Schema({

     fullName: {
          type: String,
          required: [true, "Please provied your first name"]
     },
     title: {
          type: String,
          required: function () {
               return this.type === ACCOUNT_TYPES.DOCTOR;
          },
          enum: ["Dr"],
          message: 'Title is required for doctor accounts'
     },
     specialization: {
          type: String,

          required: function () {
               return this.type === ACCOUNT_TYPES.DOCTOR;
          },
          message: 'Specialization is required for doctor accounts'
     },
     email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          validate: [validator.isEmail, 'Please provide a valid email'],
     },
     number: {
          type: String,
          required: [true, "Please provide a valid number"],
     },
     password: {
          type: String,
          required: [true, "Please provied your password"]
     },
     image: {
          type: String,
          required: false
     },
     type: {
          type: String,
          enum: ACCOUNT_TYPES,
          default: ACCOUNT_TYPES.USER,
     },
     patients: {
          type: Number,
          required: function () {
               return this.type === ACCOUNT_TYPES.DOCTOR ? true : false;
          },
          default: 0,
     },
     years_of_exp: {
          type: Number,
          required: function () {
               return this.type === ACCOUNT_TYPES.DOCTOR;
          },
          message: 'Years of experience is required for doctor accounts'
     },
     demography: {
          type: String,
          required: function () {
               return this.type === ACCOUNT_TYPES.DOCTOR;
          },
          message: 'Demography  is required for doctor accounts'

     }



}, { timestamps: true })



UserSchema.pre('save', async function () {

     if (!this.isModified('password')) return;
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
     return jwt.sign(
          { userId: this._id, fullName: this.fullName, email: this.email, type: this.type },
          process.env.JWT_SECRET,
          {
               expiresIn: process.env.JWT_LIFETIME,
          }
     )
}


UserSchema.methods.comparePassword = async function (canditatePassword) {
     const isMatch = await bcrypt.compare(canditatePassword, this.password);
     return isMatch;
};


module.exports = mongoose.model("User", UserSchema);