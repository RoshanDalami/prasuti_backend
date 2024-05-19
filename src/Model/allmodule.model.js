import mongoose,{Schema} from "mongoose";

const allModuleSchema = new Schema({
    title:{
        type:String
    }
});

export const AllModule = mongoose.models.AllModule || mongoose.model('AllModule',allModuleSchema)