const sharp = require('sharp');
const fs = require('fs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Students } = require('../../models');
const {promisify}=require("util")
const reader=require('xlsx');
exports.uploadStudentExcel=catchAsync(async(req,res,next)=>{
    req.files = Object.values(req.files)
    const image = `students.xlsx`;
    const photo = req.files[0]
    const mv=promisify(photo.mv)
    console.log(13)
    await mv(`./static/${image}`)
    const filename="./static/students.xlsx"
    const file = reader.readFile(filename)  
    let data = []
    const sheets = file.SheetNames
    for(let i = 0; i < sheets.length; i++){
       const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
       temp.forEach((res) => {
          data.push(res)
       })
    }
    let array=[]
    for(let oneData of data){
        const obj={
            studentId:oneData.id,
            name:oneData.name,
            faculty:oneData.faculty,
            group:oneData.group
            }
        array.push(obj)
    }
    await Students.bulkCreate(array).then(()=>{
        console.log("Sucress")
    }).catch((error)=>{
        console.log(error)
    })
    return res.send(data)
}) 
exports.getAllStudents=catchAsync(async(req,res,next)=>{
    const limit=req.query.limit || 20
    const offset=req.query.offset || 0
    const books=await Students.findAll({limit,offset})
    return res.send(books)
})
exports.editBanner = catchAsync(async(req, res, next) => {
    const updateBanner = await Banners.findOne({where:{ id: req.params.id }})
    if (!updateBanner)
        return next(new AppError("Banner with that id not found"), 404)
    if(newDate.getMonth()==req.body.startDate.getMonth() && newDate.getDate()>=req.body.startDate.getDate()){
        req.body.isActive=true
    }
    await updateBanner.update(req.body)
    return res.status(200).send(updateBanner)
})
exports.deleteStudent = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const student = await Students.findOne({ where: { studentId:id } });

    if (!student)
        return next(new AppError('Student did not found with that ID', 404));

    // if (student.image) {
    //     fs.unlink(`static/${student.image}`, function(err) {
    //         if (err) throw err;
    //     });
    // }
    await student.destroy();

    return res.status(200).send('Successfully Deleted');
});
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}