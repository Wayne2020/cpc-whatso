var express=require('express');
var watson=require('watson-developer-cloud');
var discoveryConn=require('./discoveryConnect');
var router=express.Router();

//Operation conversation router
var conversation=new watson.ConversationV1({
    username:'7e26f093-4027-4f7e-be1e-d568b457cbe8',
    password:'mlMSnYQFrAPz',
    version_date:'2017-11-07'
});


router.get('/api/operation',function(req,res){
   var workspace=process.env.WORKSPACE_IDA||'<workspace-id>';
   var payload={
       workspace_id:workspace,
       context:{},
       input:{}
   };
   try {
       payload.input=req.body.input;
       payload.context=req.body.context;
       conversation.message(payload,function(err,data){
          var returnObject=null;
          if(err){
              console.error(JSON.stringify(err,null,2));
              returnObject=res.status(err.code||500).json(err);
          }else{
              returnObject=res.json(updateMessage(payload,data));
          }
       });
   } catch (error) {
       console.log(error);
   }
});
//pcms combine discovery and conversation

router.get('/api/pcms',function(req,res){
    var workspace=process.env.WORKSPACE_IDA||'<workspace-id>';
    var payload={
        workspace_id:workspace,
        context:{},
        input:{}
    };
    try {
        payload.input=req.body.input;
        payload.context=req.body.context;
        conversation.message(payload,function(err,data){
           var returnObject=null;
           if(err){
               console.error(JSON.stringify(err,null,2));
               returnObject=res.status(err.code||500).json(err);
           }else{
               if(data.output.text[0]==null){
                var paramsD={
                    environment_id:'47742cd0-5a39-4d5b-afe7-dc2de117e28e',
                    collection_id:'163accd3-7bf6-41f5-ae44-a572318c8693',
                    query_string:payload.input,
                    username:'44e0a0de-d6b1-4203-b3b7-58cd05ecfffe',//pcms usernames
                    password:'DSAt7Atkgpkj'
                  };
                 discoveryConnect.discoveryConnect(paramsD,function(data){
                    returnObject=res.send(data);
                  });//discovery pcms message
               }else{
               returnObject=res.json(updateMessage(payload,data));
               }
           }
        });
    } catch (error) {
        console.log(error);
    }
});
//eng just use discovery

router.get('/api/eng',function(req,res){
    var paramsDA={
        environment_id:'b08db2f2-ba40-46e0-b46a-ede129ac519d',
        collection_id:'6bd380f3-49e9-49df-bb49-5978cee00af7',
        query_string:req.body.input,
        username:'aaddaa75-e376-414e-96e7-e9c54e317c32',//eng sabu usernames
        password:'Bq6m1hOM4u3L'
      };
      var returnObject = null;
      try {
        discoveryConnect.discoveryConnect(paramsDA,function(data){          
            returnObject=res.send(data);
          });//discovery eng message
      } catch (error) {
          console.log(error);
          res.send(500);
      }
    
    });
//update Every Message change buffer
    function updateMessage(input,response){
        var responseText=null;
        if(!response.output){
            response.output={};
        }
        response.output.text=responseText;
        return response;
    }
module.exports=router;