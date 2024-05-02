import { ApiResponse } from "../utils/ApiResponse.js";
import { BabyDetail } from "../Model/baby.model.js";
import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import { DaanDarta } from "../Model/donorDetails.model.js";
import { MilkRequsition } from "../Model/requistion.model.js";
import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
async function GetTotalBaby(req, res) {
  try {
    const response = await BabyDetail.find({});
    const totalBaby = response.length;
    return res
      .status(200)
      .json(new ApiResponse(200, totalBaby, "Number of baby "));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Errro"));
  }
}

async function GetTotalDonor(req, res) {
  try {
    const response = await DaanDarta.find({ isDonorActive: true });
    return res
      .status(200)
      .json(new ApiResponse(200, response.length, "Total Number of Donor"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function GetTotalMilkCollected(req, res) {
  try {
    const response = await MilkVolume.find({});
    const newArray = response?.map((item) => {
      return item.totalMilkCollected;
    });
    const totalMilkCollected = newArray.reduce(
      (acc, amount) => acc + amount,
      0
    );
    return res
      .status(200)
      .json(new ApiResponse(200, totalMilkCollected, "Total milk collected"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetTotalRequsition(req, res) {
  try {
    let array = [];
    const response = await MilkRequsition.find({});
    response.forEach((item) => {
      const newArray = item.requisitedMilk?.map((x) => x.quantity);
      array.push(...newArray);
    });
    const totalMilkRequ = array?.reduce((acc, amt) => acc + amt, 0);
    return res
      .status(200)
      .json(new ApiResponse(200, totalMilkRequ, "Total Milk Requsition"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkCollectedMonthly(req, res) {
  try {
    const activeFiscalYear = await Fiscal.findOne({status:true})
    const response = await MilkVolume.find();
    
    // const bai = response
    //   .map((item) => {
    //       if (item.date.split("-")[1] === "01") {
    //           if (item.totalMilkCollected != null) {
              
    //         return item.totalMilkCollected;
    //       }
    //     }
    //   })
      const bai = response.filter((item)=>item.date.split("-")[1] === "01" ) .map((item) => {
        if (item.date.split("-")[1] === "01") {
            if (item.totalMilkCollected != null) {
            
          return item.totalMilkCollected;
        }
      }
    }).reduce((acc, amt) => acc + amt, 0)
      console.log(bai)
    const jestha = response.filter((item)=>item.date.split("-")[1] === "02" )
      .map((item) => {
        if (item.date.split("-")[1] === "02") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const ashad = response.filter((item)=>item.date.split("-")[1] === "03" )
      .map((item) => {
        if (item.date.split("-")[1] === "03") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const sarwan = response.filter((item)=>item.date.split("-")[1] === "04" )
      .map((item) => {
        if (item.date.split("-")[1] === "04") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const bhadra = response.filter((item)=>item.date.split("-")[1] === "05" )
      .map((item) => {
        if (item.date.split("-")[1] === "05") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const ashoj = response.filter((item)=>item.date.split("-")[1] === "06" )
      .map((item) => {
        if (item.date.split("-")[1] === "06") {
          if (typeof(item.totalMilkCollected) != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const kartik = response.filter((item)=>item.date.split("-")[1] === "07" )
      .map((item) => {
        if (item.date.split("-")[1] === "07") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const mangsir = response.filter((item)=>item.date.split("-")[1] === "08" )
      .map((item) => {
        if (item.date.split("-")[1] === "08") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const poush = response.filter((item)=>item.date.split("-")[1] === "09" )
      .map((item) => {
        if (item.date.split("-")[1] === "09") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const magh = response.filter((item)=>item.date.split("-")[1] === "10" )
      .map((item) => {
        if (item.date.split("-")[1] === "10") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const falgun = response.filter((item)=>item.date.split("-")[1] === "11" )
      .map((item) => {
        if (item.date.split("-")[1] === "11") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const cahitra = response.filter((item)=>item.date.split("-")[1] === "12" )
      .map((item) => {
        if (item.date.split("-")[1] === "12") {
          if (item != null) {
            return item.totalMilkCollected;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const newArray = [
      bai,
      jestha,
      ashad,
      sarwan,
      bhadra,
      ashoj,
      kartik,
      mangsir,
      poush,
      magh,
      falgun,
      cahitra,
    ];
    return res.status(200).json(new ApiResponse(200, newArray, "List"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkRequsitionMonthly(req, res) {
  try {
    const response = await MilkRequsition.find({});
    const bai = response.filter((item)=>item.feedingDate.split("-")[1] === "01" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "01") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const jestha = response.filter((item)=>item.feedingDate.split("-")[1] === "02" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "02") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const ashad = response.filter((item)=>item.feedingDate.split("-")[1] === "03" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "03") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const sarwan = response.filter((item)=>item.feedingDate.split("-")[1] === "04" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "04") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const bhadra = response.filter((item)=>item.feedingDate.split("-")[1] === "05" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "05") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const ashoj = response.filter((item)=>item.feedingDate.split("-")[1] === "06" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "06") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const kartik = response.filter((item)=>item.feedingDate.split("-")[1] === "07" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "07") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const mangsir = response.filter((item)=>item.feedingDate.split("-")[1] === "08" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "08") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const poush = response.filter((item)=>item.feedingDate.split("-")[1] === "09" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "09") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const magh = response.filter((item)=>item.feedingDate.split("-")[1] === "10" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "10") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const falgun = response.filter((item)=>item.feedingDate.split("-")[1] === "11" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "11") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const cahitra = response.filter((item)=>item.feedingDate.split("-")[1] === "12" )
      .map((item) => {
        if (item.feedingDate.split("-")[1] === "12") {
          if (item != null) {
            return item.totalRequisitedMilk;
          }
        }
      })
      .reduce((acc, amt) => acc + amt, 0);
    const newArray = [
      bai,
      jestha,
      ashad,
      sarwan,
      bhadra,
      ashoj,
      kartik,
      mangsir,
      poush,
      magh,
      falgun,
      cahitra,
    ];
    return res.status(200).json(new ApiResponse(200, newArray, "List"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}



export {
  GetTotalBaby,
  GetTotalDonor,
  GetTotalMilkCollected,
  GetTotalRequsition,
  GetMilkCollectedMonthly,
  GetMilkRequsitionMonthly,
};
