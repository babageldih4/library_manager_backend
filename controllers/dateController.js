const { Banners,Orders,Dayincome } = require("../models")
const moment = require('moment-timezone');


const { Op } = require("sequelize")
const schedule = require("node-schedule")
const fs = require("fs")
const dates = schedule.scheduleJob('0 19 16 * * *', async function() {
    const now=new Date()
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),5,0,0)
    const banner=await Banners.update({isActive:false},{where:{endDate:today}})
    const new_banners=await Banners.update({isActive:true},{where:{startDate:today}})
});
const orders = schedule.scheduleJob('20 14 12 * * *', async function() {
    let where={}
    const now = new Date();
    now.setHours(0,0,0,0)
    // Create a moment object representing the current date and time in GMT+5
    where.createdAt = {
        [Op.gte]: now,
    }
    where.status="onTheWay"
    let sum = await Orders.sum("total_price",{
        where,
    });
    let dayincome=await Dayincome.create({income:sum})
    console.log(dayincome)
})
module.exports = () => { dates }