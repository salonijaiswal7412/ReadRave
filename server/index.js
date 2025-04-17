const express=require('express');
const cors=require('cors');
require('dotenv').config();

const app=express();
app.use(cors());

const PORT=process.env.PORT||5000;
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Backend working fine");
});

app.listen(PORT,()=>{
    console.log(`Server running on port http://localhost:${PORT}`)
}).on('error',(err)=>{
    console.log('error');
});