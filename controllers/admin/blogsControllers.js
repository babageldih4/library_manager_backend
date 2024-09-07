const sharp = require('sharp');
const fs = require('fs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {v4}=require("uuid")
const { Blogs,Images,Video } = require('../../models');
const { Op } = require('sequelize');
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.getAllBlogs=catchAsync(async(req,res,next)=>{
    let { keyword} = req.query;
    var where = {};
    if (keyword && keyword != "undefined") {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
        where = {
            [Op.or]: [{
                    header_tm: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    header_ru: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    header_en: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    body_tm: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    body_ru: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    body_en: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
            ],
        };
    }
    if(req.query.filter){
        const filter=JSON.parse(req.query.filter)
        const endDate=new Date(filter.endDate)
        const startDate=new Date(filter.startDate)
        if(filter.startDate!=undefined){
            where.createdAt = {
                [Op.gte]: startDate,
                [Op.lte]: endDate 
            }
        }
    }
    const limit=req.query.limit || 20
    const offset=req.query.offset || 0
    const data=await Blogs.findAll({
        where,
        order:[["updatedAt","DESC"]],
        limit,
        offset,
    })
    const count=await Blogs.count({where})
    return res.send({data,count})
})
exports.addBlogs=catchAsync(async(req,res,next)=>{
    const blogs=await Blogs.create(req.body);
    return res.status(201).send(blogs)
})
exports.editBlogs=catchAsync(async(req,res,next)=>{
    const blogs=await Blogs.findOne({where:{id:req.params.id}})
    if(!blogs) return next(new AppError("Blogs not found",404))
    await blogs.update(req.body)
    return res.send(blogs)
})
exports.deleteBlogs=catchAsync(async(req,res,next)=>{
    const blogs=await Blogs.findOne({where:{id:req.params.id}})
    if(!blogs) return next(new AppError("Blogs not found",404))
    await blogs.destroy()
    return res.send("Success")
})
exports.uploadImages=catchAsync(async(req,res,next)=>{
    // const id = req.params.id;
    // const blogs = await Blogs.findOne({ where: { id } });
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)
    for (const images of req.files) {
        const image_id = v4()
        var image = `${image_id}_blogs.webp`;
        const photo = images.data
        let buffer = await sharp(photo).webp().toBuffer()
        await sharp(buffer).toFile(`static/${image}`);
        // await blogs.update({image})
    }
    return res.status(201).send(image);
})
exports.deleteImage=catchAsync(async(req,res,next)=>{
    const {image}=req.params
    fs.unlink(`static/${image}`,(err)=>{
        if(err) {
            console.log(err)
            return next(new AppError("Not deleted",400))
        }
        return res.send("Sucess")
    })
})
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}