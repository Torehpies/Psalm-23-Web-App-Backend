import mongoose from "mongoose";


const EmployeeSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },

        TotalWorkHours:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)


export default mongoose.model("Employee", EmployeeSchema);

