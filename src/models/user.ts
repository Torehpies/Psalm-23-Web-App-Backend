import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            require: true
        },
        lastName:{
            type: String,
            require: true
        },
        email:{
            type: String,
            require: true,
            unique: true
        },
        password:{
            type: String,
            require: true
        },
        isAdmin:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("User", UserSchema);