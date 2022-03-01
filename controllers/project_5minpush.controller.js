const mongoose=require("mongoose");
const axios=require("axios");
const {POADataModel,POADataSchema} = require("../models/POAData");

POADataPush=async (req,res,next)=>{
    const headers={
        "x-access-token":req.app.locals.x_access_token
    }
    const reqBody={ 
        "stream_name": "project_5min",
        "from_date": req.body.from_date, 
        "to_date": req.body.to_date, 
        "select_columns": ["*"], 
        "filter_criteria": { "project_id": req.body.project_id} 
    }
    await axios.post("https://sensehawk-api.strategix4.com/api/streams/getstream",reqBody,{headers:headers})
    .then(async (data)=>{
        const Response=data.data.data;
        console.log(Response.length);
        await POADataModel.insertMany(Response,{"strict":false})
                .then(()=>{
                    res.send({"sent":true})
                })
                .catch(async (err)=>{
                    let bulkWriteQuery=[]
                    for(let dup of err.writeErrors){
                        dup=dup.err.op;
                        let sq={
                            timestamp:dup.timestamp,
                            project_id:dup.project_id,
                            swiftPV_project_id:dup.swiftPV_project_id
                        }
                        setQuery={}
                        for(i of Object.keys(dup)){
                            if(i!="timestamp"&&i!="swiftPV_project_id"&&i!="project_id"&&i!="_id"&&i!="__v"){
                                setQuery[i]=dup[i]
                            }
                        }
                        let update={
                            $set:setQuery
                        }
                        let updateQuery={
                            "updateOne":{
                                "filter":sq,
                                "update":update
                            }
                        };
                        bulkWriteQuery.push(updateQuery);
                    }
                    await POADataModel.bulkWrite(bulkWriteQuery,(err,client)=>{
                        if(err){
                            console.log(err);
                            res.send({ERR:err});
                        }
                        res.send({"sent":true});
                    })

                })

    })
    .catch((err)=>{
        console.log("E",err);
        res.send({"sent":false,"err":err});
    })
}

module.exports=POADataPush
