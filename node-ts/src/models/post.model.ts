import { model, Schema , Types} from "mongoose"

interface IPost {
    title : string 
    description : string
    content : string
    user : Types.ObjectId;
    
}

const PostSchema = new Schema<IPost>({
    title :{
        required : true,
        type : String
    },
     description :{
        required : true,
        type : String
    },
     content :{
        required : true,
        type : String
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
})

export const Post = model<IPost>("Post", PostSchema)