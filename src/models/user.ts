import mongoose, {Schema} from 'mongoose';

export enum Role {
    Admin = 'admin',
    Manager = 'manager',
    Baker = 'baker',
    Barista = 'barista',
    Cashier = 'cashier',
    Helper = 'helper',
}

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        role:{
            type: String,
            required: true,
            default: 'helper'
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("User", UserSchema);
