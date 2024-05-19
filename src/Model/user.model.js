import mongoose,{Schema} from 'mongoose';


const moduleAccessSchema = new Schema({
    title:{
        type:String,
    }
})
const userSchema = new Schema({
    username:{
        type:String,
        required:[true,'Username is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    contactNo:{
        type:String,
        required:[true,'Contact Number is required']
    },
    password:{
        type:String,
        required:[true,'Password is required field']
    },
    role:{
        type:String,
        required:true
    },
    assignedModule:[moduleAccessSchema]
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;