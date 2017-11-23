var Api=(function(){
   var requestPayload;
   var responsePayload;
   var messageOperationEndpoint='/api/operation';
   var messagePcmsEndpoint='/api/pcms';
   var messageEngEndpoint='/api/eng';

   return {
       sendRequest: sendRequest,

       getRequestPayload:function(){
           return requestPayload;
       },
       setRequestPayload:function(newPayloadStr){
           requestPayload=JSON.parse(newPayloadStr);
       },
       getResponsePayload:function(){
           return responsePayload;
       },
       setResponsePayload:function(newPayloadStr){
           responsePayload=JSON.parse(newPayloadStr);
       }
   };

   function sendRequest(text,context,workSpace){
           // Build request payload
    var payloadToWatson = {};
    if (text) {
        payloadToWatson.input = {
          text: text
        };
      }
      if (context) {
        payloadToWatson.context = context;
      }
  
      if(workSpace){
        payloadToWatson.workSpace=workSpace;
      }
      // Built http request different scope open different http protocol
      var http= new XMLHttpRequest();
      if(workSpace=="ENG"){
         http.open('POST',messageEngEndpoint,true);
      }else if(workSpace=="PCMS"){
        http.open('POST',messagePcmsEndpoint,true);
      }else {
        http.open('POST',messageOperationEndpoint,true);
      }

      http.setRequestHeader('Content-type','application/json');
      http.onreadystatechange=function(){
          if(http.readyState ===4 && http.status === 200&&http.responseText){
              Api.setResponsePayload(http.responseText);
          }
      };

      var params=JSON.stringify(payloadToWatson);
      // Stored in variable (publicly visible through Api.getRequestPayload)
      // to be used throughout the application
      if(Object.getOwnPropertyNames(payloadToWatson).length !==0){
          Api.setRequestPayload(params);
      }

      //send request
      http.send(params);
   }
}());