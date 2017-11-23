var express = require('express');
var session=require('express-session');
var router = express.Router();
var bluepages=require("./bluepages");
var watson=require('watson-developer-cloud');
var discoveryConn=require('./discoveryConnect');


//Operation conversation router
var conversation=new watson.ConversationV1({
    username:'7e26f093-4027-4f7e-be1e-d568b457cbe8',
    password:'mlMSnYQFrAPz',
    version_date:'2017-11-07'
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'welcome to WhatSo' });
});

router.get('/result',function(req,res){
  try {
    if(req.session.user.length!=0){
      bluepages.getPersonInfoByIntranetID(req.session.user.internetid,function(data){
        console.log(data);
        res.render('result',{title:'result',userName:data.userName,userPhoto:data.userPhoto,userJobrespons:data.userJobrespons,userTelephonenumber:data.userTelephonenumber,userEmail:data.userEmail});
      });
      }else{
        res.render('index',{title:"index"});
      };
  } catch (error) {
   console.log(error);
  //res.render('result',{title:"result"});
    res.render('index',{title:"index"});
 }
});

router.get('/test',function(req,res){
  res.render('test',{title:"welcome to test"});
})

router.post('/index',function(req,res){
  var intranetId=req.body.intranetId;
  var password=req.body.password;
  var user={'internetid':intranetId,'password':password};
  try {
  bluepages.authenticate(intranetId,password,function(data){
    if(data){
      req.session.user=user;
      res.json(200,{url:"/result"});
    }else{
      res.send(404);
    }
  });
} catch (error) {
  console.log(error);
  res.sendStatus(500);
}
});

router.post('/api/operation',function(req,res){
   var workspace="616f8002-4864-4bd7-8477-85c60f1713d7";
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

router.post('/api/pcms',function(req,res){
    var workspace="a4687bce-4c25-4cfe-a980-2fd0bf7be12e";
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
                    collection_id:'9e75cb8d-16e0-4168-9c37-8c53d3007df5',
                    query_string:payload.input,
                    username:'44e0a0de-d6b1-4203-b3b7-58cd05ecfffe',//pcms usernames
                    password:'DSAt7Atkgpkj'
                  };
                 discoveryConn.discoveryConnect(paramsD,function(data){
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

router.post('/api/eng',function(req,res){
    var paramsDA={
        environment_id:'b08db2f2-ba40-46e0-b46a-ede129ac519d',
        collection_id:'6bd380f3-49e9-49df-bb49-5978cee00af7',
        query_string:req.body.input,
        username:'aaddaa75-e376-414e-96e7-e9c54e317c32',//eng sabu usernames
        password:'Bq6m1hOM4u3L'
      };
      var returnObject = null;
      try {
        discoveryConn.discoveryConnect(paramsDA,function(data){          
            returnObject=res.send(data);
          });//discovery eng message
      } catch (error) {
          console.log(error);
          res.send(500);
      }
    
    });
//update Every Message change buffer
/**
 * Updates the response text using the intent confidence
 *
 * @param {Object}
 *                input The request to the Conversation service
 * @param {Object}
 *                response The response from the Conversation service
 * @return {Object} The response with the updated message
 */
function updateMessage(input, response) {
    var responseText = null;
    if (!response.output) {
      response.output = {};
    } else {
      return response;
    }
    response.output.text = responseText;
    return response;
  }

module.exports = router;
