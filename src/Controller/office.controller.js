import { Department } from "../Model/officeSetupModels/department.model.js";
import { District } from "../Model/officeSetupModels/district.model.js";
import { Employee } from "../Model/officeSetupModels/employee.model.js";
import { Office } from "../Model/officeSetupModels/office.model.js";
import { Palika } from "../Model/officeSetupModels/palika.model.js";
import { Post } from "../Model/officeSetupModels/post.model.js";
import { State } from "../Model/officeSetupModels/state.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function RegisterOffice(req, res) {
  try {
    let officeId = 1;
    const latestOffice = await Office.findOne(
      {},
      {},
      { sort: { officeId: -1 } }
    );
    if (latestOffice) {
      const latestOfficeId = latestOffice?.officeId;
      officeId = latestOfficeId + 1;
    }
    const {
      office_name,
      office_code,
      office_address,
      office_phone,
      office_email,
      stateId,
      districtId,
      palikaId,
    } = req.body;
    if (
      !office_name ||
      !office_code ||
      !office_address ||
      !office_phone ||
      !office_email ||
      !stateId ||
      !stateId ||
      !districtId ||
      !palikaId
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Fields are required"));
    }
    const newOffice = new Office({
      office_name,
      office_code,
      office_address,
      office_phone,
      office_email,
      stateId,
      districtId,
      palikaId,
      officeId,
    });
    await newOffice.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newOffice, "Office Created Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetOffice(req, res) {
  try {
    const response = await Office.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Office generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetState(req, res) {
  try {
    const response = await State.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, response, "State generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetDistrict(req, res) {
  const stateId = req.query.stateId;
  try {
    const response = await District.find({ stateId: stateId });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "District generated successfully "));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetPalika(req, res) {
  const districtId = req.query.districtId;
  try {
    const response = await Palika.find({ districtId: districtId });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Palika generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function RegisterDepartment(req, res) {
  try {
    const { userId, departmentName, officeId } = req.body;

    let departmentId = 1;
    const latestDepartment = await Department.findOne(
      {},
      {},
      { sort: { departmentId: -1 } }
    );
    if (latestDepartment) {
      const latestDepartmentId = latestDepartment.departmentId;
      departmentId = latestDepartmentId + 1;
    }
    const newDepartment = new Department({
      userId,
      departmentName,
      officeId,
      departmentId,
    });
    await newDepartment.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, newDepartment, "Department created successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetDepartment(req, res) {
  try {
    const response = await Department.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function RegisterPost(req, res) {
  const { userId, postName, departmentId } = req.body;
  try {
    let postId = 1;
    const latestPost = await Post.findOne({}, {}, { sort: { postId: -1 } });
    if (latestPost) {
      const latestPostId = latestPost?.postId;
      postId = latestPostId + 1;
    }
    const newPost = new Post({
      userId,
      postName,
      departmentId,
      postId,
    });
    await newPost.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newPost, "Post created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetPost(req, res) {
  try {
    const response = await Post.find({});
    const newArray = await Promise.all(
      response?.map(async (item) => {
        try {
          const department = await Department.findOne({
            departmentId: item.departmentId,
          });
          const departmentName = department?.departmentName;
          return { ...item.toObject(), departmentName: departmentName };
        } catch (error) {
          console.error("Error while fetching department:", error);
          // Return a default object or null if department lookup fails
          return { ...item.toObject(), departmentName: null };
        }
      })
    );
    return res
      .status(200)
      .json(new ApiResponse(200, newArray, "Post generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function RegisterEmployee(req, res) {
  const {
    userId,
    departmentId,
    postId,
    employeeName,
    employeeEmail,
    employeePhone,
  } = req.body;

  try {
    let employeeId = parseInt(1, 10);
    const latestEmployee = await Employee.findOne(
      {},
      {},
      { sort: { employeeId: -1 } }
    );

    if (latestEmployee) {
      const latestEmployeeId = latestEmployee?.employeeId;

      employeeId = latestEmployeeId + 1;
    }
    const newEmployee = new Employee({
      userId,
      departmentId,
      postId,
      employeeEmail,
      employeeName,
      employeePhone,
      employeeId,
    });
    await newEmployee.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newEmployee, "Employee Created Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetEmployee(req, res) {
  try {
    const response = await Employee.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Employee generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function EmployeeActiveDeactive(req,res){
  try {
    const {id}= req.params;
    const individualEmployee = await Employee.findOne({_id:id});
    if(individualEmployee?.isActive === true){
      const response = await Employee.findOneAndUpdate({_id:id},{
        $set:{isActive:false}
      },{new : true})
      return res.status(200).json(new ApiResponse(200,response,"Employee updated successfully"))
    } else{
      const response = await Employee.findOneAndUpdate({_id:id},{
        $set:{isActive:true}
      },{new : true})
      return res.status(200).json(new ApiResponse(200,response,"Employee updated successfully"))
    }
  } catch (error) {
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
  }
}

export {
  RegisterOffice,
  GetOffice,
  GetState,
  GetPalika,
  GetDistrict,
  RegisterDepartment,
  GetDepartment,
  RegisterPost,
  GetPost,
  RegisterEmployee,
  GetEmployee,
  EmployeeActiveDeactive
};
