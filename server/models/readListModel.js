const mongoose=require('mongoose');

const readListSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    googleBookId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['wantToRead','currentlyReading','finishedReading'],
        default:'wantToRead',
    },
    addedAt:{
        type:Date,
        default:Date.now,

    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    favorite: {
         type: Boolean,
          default: false 
    },
    isPublic: { 
        type: Boolean, default: true 
    }

});
readListSchema.index({user:1,googleBookId:1},{unique:true});
module.exports=mongoose.model('ReadingList',readListSchema);