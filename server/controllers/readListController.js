const readingList=require('../models/readListModel');

exports.addToReadList=async(req,res)=>{
    const {googleBookId,status}=req.body;
    try{
        const entry=await readingList.create({
            user:req.user._id,
            googleBookId,
            status,
        });
        res.status(200).json(entry);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};

exports.getReadList=async(req,res)=>{
    const list=await readingList.find({user:req.user._id});
    res.json(list);
};

exports.updateReadListItem=async(req,res)=>{
    const {googleBookId}=req.params;
    try{
        const updated=await readingList.findOneAndUpdate({
            user:req.user._id,googleBookId
        },
    {...req.body,updatedAt:Date.now()},{new:true});
    res.json(updated);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }

};

exports.removeFromReadList=async(req,res)=>{
    const {googleBookId}=req.params;
    await readingList.findOneAndDelete({user:req.user._id,googleBookId});
    res.json({message:'removed successfully'});

}