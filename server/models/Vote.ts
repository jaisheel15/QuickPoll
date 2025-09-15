import mongoose, {Schema} from 'mongoose';

 const VoteSchema = new Schema({
    pollId:{
        type:Schema.Types.ObjectId,
        ref:'Poll',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true   
    },
    optionIndex:{
        type:Number,
        required:true
    }
})

const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;