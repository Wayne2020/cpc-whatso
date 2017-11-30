var Api=(function(){
   var loadprocess = 100; //a progress bar precent
   var requestPayload;
   var responsePayload;
   var messageOperationEndpoint='/api/operation';
   var messagePcmsEndpoint='/api/pcms';
   var messageEngEndpoint='/api/eng';
   var settings = {
       selectors:{
        chatBox: '#whatso_scrollingChat'
       }
   }
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
      
      var http= new XMLHttpRequest();
      // set timeout
      http.timeout = 30000;
      // Built http request different scope open different http protocol
      if(workSpace=="ENG"){
         http.open('POST',messageEngEndpoint,true);
      }else if(workSpace=="PCMS"){
        http.open('POST',messagePcmsEndpoint,true);
      }else {
        http.open('POST',messageOperationEndpoint,true);
      }

      http.onloadstart = function(e){
        //here we do start insert the progress bar in conversation scrollingChat
        var progressBarDom = buildProgressDom();
        var chatBoxElement = document.querySelector(settings.selectors.chatBox);
        chatBoxElement.appendChild(progressBarDom);
        var chatlist = document.getElementById("whatso_scrollingChat");
        chatlist.insertBefore(progressBarDom,chatlist.childNodes[0]);
        document.getElementById('whatso_input').removeAttribute('onkeydown');

      };
     http.onprogress = function(e){
        //here we do calculate the progress bar in conversation scrollingChat
     }
      http.onloadend = function(e){
          //here we do remove the progress bar in conversation scrollingChat
          var chatlist = document.getElementById("whatso_scrollingChat");
          chatlist.removeChild(chatlist.childNodes[1]);
          document.getElementById('whatso_input').setAttribute('onkeydown',"ConversationPanel.inputKeydown(event,this)");
      };

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
      http.ontimeout = function(error){
        var chatlist = document.getElementById("whatso_scrollingChat");
        chatlist.removeChild(chatlist.childNodes[0]);
          document.getElementById('whatso_input').setAttribute('onkeydown',"ConversationPanel.inputKeydown(event,this)");
          alert("Ooops~ Server timeout,please search other keyword instead !");
      }
      //send request
      http.send(params);
   }
   //build prograss bar div
   function buildProgressDom(){
       var messageDomJson = {
           'tagName':'li',
           'classNames':['ballAll'],
           'children':[{
               'tagName':'div',
               'classNames':['wBall'],
               'attributes':[{name:'id',value:'wBall_1'}],
               'children':[{
                   'tagName':'div',
                   'classNames':['wInnerBall'],
               }]
           },{
            'tagName':'div',
            'classNames':['wBall'],
            'attributes':[{name:'id',value:'wBall_2'}],
            'children':[{
                'tagName':'div',
                'classNames':['wInnerBall'],
            }]
        },{
            'tagName':'div',
            'classNames':['wBall'],
            'attributes':[{name:'id',value:'wBall_3'}],
            'children':[{
                'tagName':'div',
                'classNames':['wInnerBall'],
            }]
        },{
            'tagName':'div',
            'classNames':['wBall'],
            'attributes':[{name:'id',value:'wBall_4'}],
            'children':[{
                'tagName':'div',
                'classNames':['wInnerBall'],
            }]
        },{
            'tagName':'div',
            'classNames':['wBall'],
            'attributes':[{name:'id',value:'wBall_5'}],
            'children':[{
                'tagName':'div',
                'classNames':['wInnerBall'],
            }]
        }]
       };
       return Common.buildDomElement(messageDomJson);
   }
}());