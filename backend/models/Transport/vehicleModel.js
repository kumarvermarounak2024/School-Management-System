const mongoose= require("mongoose")

const vehicleSchema=new mongoose.Schema({
vehicleNumber:{
type:String,
required:true,
trim:true


},

capacity:{
    type:Number,
    required:true

},
insuranceRenewalDate:{
    type:Date,
    required:true,
},


driverName:{
    type:String,
    required:true,
    trim:true

},
driverPhoneNumber:{
    type:String,
    required:true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
},
driverLicenseNumber:{
    type:String,
    required:true,
    trim:true
},
},{timestamps:true});
module.exports=mongoose.model("Vehicle",vehicleSchema);