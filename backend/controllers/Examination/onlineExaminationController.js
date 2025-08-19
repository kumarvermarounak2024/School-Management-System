const OnlineExam=require('../../models/Examination/onlineExaminationDetail')
exports.createOnlineExam=async (req, res)=>{

try{

const newExam=new OnlineExam(req.body);
const savedExam=await newExam.save();
res.status(201).json({
    message:"Exam created successfully",
    data:savedExam
})
}catch(error){

console.error('Error creating online Exam:',error);

res.status(500).json({
    message:"Error creating online Exam",
    error:error.message
})
}
}

exports.getAllOnlineExam=async (req,res)=>{
try{
const exams=await OnlineExam.find();
res.status(200).json({

message:"Fetched online Exam Successfully",
data:exams
})
}catch(error){
console.log(error)
res.status(500).json({
message:'Failed to fetch Exam',error:error.message

})

}
};

exports.getOnlineExamById=async (req,res)=>{
try{
const exam=await OnlineExam.findById(req.params.id);
if(!exam) return res.status(404).json({message:"Exam not found"});

res.status(200).json(exam);


}catch(error){

res.status(500).json({
    message:"Error Fetching exam",
    error:error.message

})
}
};
exports.updateOnlineExam=async (req,res)=>{
try{
const updated=await OnlineExam.findByIdAndUpdate(req.params.id,req.body,{new:true});
if(!updated) return res.status(404).json({message:'Exam not found'});
res.status(200).json({message:'Exam updated successfully'});
}catch(error){
res.status(500).json({message:'Update failed', error:error.message})
}

};

exports.deleteOnlineExam=async(req,res)=>{
    try{

 const deleted =await OnlineExam.findByIdAndDelete(req.params.id);
 if(!deleted) return res.status(404).json({message:'Exam not found'});
 res.status(200).json({
    message:'Exam deleted successfully',
 })



    }catch(error){
res.status(500).json({message:"Delete failed",
    error:error.message})

    }
}