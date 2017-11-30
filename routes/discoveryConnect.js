var request = require("request");
//request is a protocol to connect http and get response from the url as json
module.exports.discoveryConnect = function(params,callback){
    var options={
        url:"https://gateway.watsonplatform.net/discovery/api/v1/environments/"+params.environment_id+"/collections/"+params.collection_id+"/query?version=2017-09-01&count=&offset=&aggregation=&filter=&passages=true&highlight=true&return=&natural_language_query="+params.query_string.text,
        auth:{
            username:params.username,
            password:params.password
        }
    };
    function getResponse(error,response,body){
        if(!error && response.statusCode==200){
            var results=[];
            var getbody=JSON.parse(body);
            if(getbody.matching_results!==0){
                if(getbody.results.length>=10){
                    for(var i=0;i<10;i++){
                        results.push({
                           resultsHighlight:getbody.results[i].highlight.text,
                           resultsFile:ChangeFileName(getbody.results[i].extracted_metadata.filename)
                        });
                    }
                }else{
                for(var i=0;i<getbody.results.length;i++){
                    results.push({
                       resultsHighlight:getbody.results[i].highlight.text,
                       resultsFile:ChangeFileName(getbody.results[i].extracted_metadata.filename)
                    });
                }
            }
            }else{
                var resultsScope=params.scope=="PCMS"?["Now, we do not have answers to your question, please feel free to contact wenyu@cn.ibm.com. Your feedback is critical to WhatSo Team! "]:["Now, we do not have answers to your question, please feel free to contact wayne@cn.ibm.com. Your feedback is critical to WhatSo Team! "];
                results.push({
                    resultsHighlight:resultsScope,
                    resultsFile:""
                });
            }
            callback(results);
        }
    }
    function ChangeFileName(file){
        var patternPDF=/(\w*\.pdf)/g;
        var patternHTML=/(\w*\.html)/g;
        var patternDOC=/(\w*\.doc)/g;
       if(patternPDF.exec(file)){
                 var str=file.split(".pdf");
                 return str[0]+".pdf";
       }else if(patternHTML.exec(file)){
                 var str=file.split(".html");
                 return str[0]+".html";
       }else if(patternDOC.exec(file)){
                 var str=file.split(".doc");
                 return str[0]+".doc";}
    }
    request(options,getResponse);
}
