const fs = require('fs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Books,Givenbooks,Students,Actions } = require('../../models');
const {promisify}=require("util")
const reader=require('xlsx');
const { where } = require('sequelize');
exports.uploadExcel=catchAsync(async(req,res,next)=>{
    req.files = Object.values(req.files)
    const image = `books.xlsx`;
    const photo = req.files[0]
    const mv=promisify(photo.mv)
    console.log(13)
    await mv(`./static/${image}`)
    const filename="./static/books.xlsx"
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
            bookId:oneData.id,
            genre:oneData.genre,
            name:oneData.name,
            stock:oneData.stock,
            inLibrary:oneData.stock,
            outLibrary:0,
            year:oneData.year
        }
        array.push(obj)
    }
    await Books.bulkCreate(array).then(()=>{
        console.log("Sucress")
    }).catch((error)=>{
        console.log(error)
    })
    return res.send(data)
    // console.log(15)
    // return res.status(201).send("Sucess");
}) 
exports.getAllBooks=catchAsync(async(req,res,next)=>{
    const limit=req.query.limit || 20
    const offset=req.query.offset || 0
    const books=await Books.findAll({limit,offset,include:{model:Students,as:"received_books"}})
    return res.send(books)
})
exports.getOneBook=catchAsync(async(req,res,next)=>{
    const one_book=await Books.findOne({where:{bookId:req.params.id},
        include:{model:Students,as:"received_books"}
    })
    return res.send(one_book)
})
exports.giveBook=catchAsync(async(req,res,next)=>{
    const one_book=await Books.findOne({where:{bookId:req.body.bookId}})
    const student=await Students.findOne({where:{studentId:req.body.studentId}})
    const givenBook=await Givenbooks.create({bookId:one_book.id,studentId:student.id})
    one_book.update({inLibrary:one_book.inLibrary-1,outLibrary:one_book.outLibrary+1})
    const d=new Date()
    const action=await Actions.create({studentId:req.body.studentId,bookId:req.body.bookId,givenDate:d.getDate()+"."+d.getMonth()+"."+d.getFullYear(),status:"given"})
    return res.send(givenBook)
})
exports.receiveBook=catchAsync(async(req,res,next)=>{
    const one_book=await Books.findOne({where:{bookId:req.body.bookId}})
    const student=await Students.findOne({where:{studentId:req.body.studentId}})
    const givenBook=await Givenbooks.findOne({where:{studentId:student.id,bookId:one_book.id}})
    one_book.update({inLibrary:one_book.inLibrary+1,outLibrary:one_book.outLibrary-1})
    const action=await Actions.findOne({where:{studentId:req.body.studentId,bookId:req.body.bookId,receivedDate:null}})
    const d=new Date()
    await action.update({receivedDate:d.getDate()+"."+d.getMonth()+"."+d.getFullYear(),status:"received"})
    await givenBook.destroy()
    return res.send("Sucess")
    
})
exports.getActions=catchAsync(async(req,res,next)=>{
    const limit=req.query.limit ||20
    const offset=req.query.offset || 0
    const actions=await Actions.findAll({limit,offset})
    let array=[]
    for (const action of actions){
        const student=await Students.findOne({where:{studentId:action.studentId}})
        const book=await Books.findOne({where:{bookId:action.bookId}})
        array.push({...action.dataValues,book,student})
    }
    return res.send(array)
})
exports.addFromExcel=catchAsync(async(req,res,next)=>{
    const filename="./static/books.xlsx"
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
    for(let oneData of data){
        const obj={
            genre:oneData.genre,
            name:oneData.name,
            stock:oneData.stock
        }
    }
    await Books.bulkCreate(obj).then(()=>{
        console.log("Sucress")
    }).catch((error)=>{
        console.log(error)
    })
    return res.send(data)
})
exports.deleteBanner = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const banner = await Banners.findOne({ where: { id } });

    if (!banner)
        return next(new AppError('Banner did not found with that ID', 404));

    if (banner.image) {
        fs.unlink(`static/${banner.image}`, function(err) {
            if (err) throw err;
        });
    }
    await banner.destroy();

    return res.status(200).send('Successfully Deleted');
});
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}