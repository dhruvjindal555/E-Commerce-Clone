const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    } ,
    date:{
        type:Date,
        default:Date.now
    },
    profileUrl:{
        type:String,
        default:""
    },
    fullName:{
        type:String,
        default:"",
        trim: true 
    },
    phoneNumber:{
        type:String,
        default:""
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pinCode: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    lastLoginDate: { type: Date }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;


// const mongoose = require('mongoose');

// // Define the User Schema
// const UserSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: [true, 'Full name is required'],
//         minlength: [1, 'Full name must be at least 1 character long'],
//         trim: true // Remove whitespace from both ends
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: true,
//         lowercase: true, // Normalize email to lowercase
//         validate: {
//             validator: function(v) {
//                 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
//             },
//             message: props => `${props.value} is not a valid email address!`
//         }
//     },
//     phoneNumber: {
//         type: String,
//         required: [true, 'Phone number is required'],
//         validate: {
//             validator: function(v) {
//                 return /^\d{10}$/.test(v); // Validate for 10-digit phone numbers
//             },
//             message: props => 'Phone number must be a 10-digit number!'
//         }
//     },
//     profileUrl: {
//         type: String,
//         default: ""
//     },
//     address: {
//         street: {
//             type: String,
//             required: [true, 'Street address is required'],
//             minlength: [1, 'Street address must be at least 1 character long']
//         },
//         city: {
//             type: String,
//             required: [true, 'City is required'],
//             minlength: [1, 'City must be at least 1 character long']
//         },
//         state: {
//             type: String,
//             default: ""
//         },
//         pinCode: {
//             type: String,
//             required: [true, 'Pin code is required'],
//             validate: {
//                 validator: function(v) {
//                     return /^\d{6}$/.test(v); // Validate for 6-digit pin codes
//                 },
//                 message: props => 'Pin code must be a 6-digit number!'
//             }
//         },
//         country: {
//             type: String,
//             required: [true, 'Country is required'],
//             minlength: [1, 'Country must be at least 1 character long']
//         }
//     },
//     dateCreated: {
//         type: Date,
//         default: Date.now
//     },
//     lastLoginDate: {
//         type: Date
//     }
// });

// // Create the User model
// const User = mongoose.model('User', UserSchema);

// module.exports = User;
