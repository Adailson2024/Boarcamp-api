export default function errorHandler(error,req,res,next){

    if(error.type==="invalidNumber"){
           return  res.status(400).send(error.message)
       }
    if(error.type==="conflict"){
           return  res.status(409).send(error.message)
       }
        
}