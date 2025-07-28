import {Schema , model ,  type InferSchemaType} from "mongoose";


export interface IUserCreateSchema{
 name : string,
 username : string,
 email : string,
 password : string,
 verification_code?: string,
 verification_code_expiry? : Date
 is_verified?: boolean
}

const userSchema = new Schema<IUserCreateSchema>({
    name : {
        type : String,
        required : true
    },
     email: {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    verification_code : {
        type : String,
        default : null
    },
    verification_code_expiry :{
        type : Date,
        required : false
    },
    is_verified : {
        type : Boolean,
        default : false
    },
    password : {
        type : String,
        required : true
    }
},{
    timestamps : true
})

export const User = model<IUserCreateSchema>("User" , userSchema);

export type IUser = InferSchemaType<typeof userSchema>