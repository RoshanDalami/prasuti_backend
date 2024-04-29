import mongoose, { Schema } from "mongoose";


const CultureBottleList = Schema({
   
    bottleId:{
        type:String,
        required:true
    },
    cultureResult:{
        type:Boolean
    }
})

const CultureSchema = Schema({
    cultureDate:{
        type:String,
        required:true
    },
    cultureEngDate:{
        type:String,
        required:true
    },
    batchId:{
        type:String,
        required:true
    },
    cultureResult:{
        type:Boolean,
        default:null
    },
    cultureBottleList : [CultureBottleList]

})

const Culter = mongoose.models.Culter || mongoose.model('Culter',CultureSchema)

export {Culter}