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
    fiscalYear: {
        type: Schema.Types.ObjectId,
        ref: "Fiscal",
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
    cultureRemark:{
        type:String,
        default:""
    },

    cultureBottleList : [CultureBottleList]

})

const Culter = mongoose.models.Culter || mongoose.model('Culter',CultureSchema)

export {Culter}