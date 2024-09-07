// const d = new Date(0)
// const fs = require('fs');

// var text = fs.readFileSync('test.txt', 'utf8')


// console.log(text)
// fs.writeFile('test.txt', '21', function(err) {
//     if (err) throw err;
//     console.log('Saved!');
// });
// exports.getDate = () => {
const d = new Date()
let expire_date = new Date()
let second_date = new Date()
second_date.setDate(second_date.getDate() - 20)
    // console.log((expire_date - second_date))
exports.getTodayAsMs = () => {
    const d = new Date()
    d.getTime()
    return d
}