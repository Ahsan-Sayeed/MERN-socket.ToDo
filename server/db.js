const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socketDB')
.then(()=>{
    console.log('database connected')
})
.catch(err=>{
    console.log(err);
});

const schema = mongoose.Schema({
    text:String
});
const Table = mongoose.model('Table',schema);
module.exports = Table;