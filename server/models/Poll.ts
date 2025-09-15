import {Schema} from 'mongoose'
import mongoose from 'mongoose';

const PollSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    question:{
        type:String,
        required:true
    },
    options:[
        {
            text:{
                type:String,
                required:true
            },
            votes:{
                type:Number,
                default:0
            }
        }


    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Poll = mongoose.model("Poll", PollSchema);

export default Poll;