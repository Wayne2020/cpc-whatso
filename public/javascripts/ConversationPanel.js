var ConversationPanel=(function(){
    var inputBox=document.getElementById("whatso_input");
    var SelectedScope=null;
    var settings = {
        selectors: {
          chatBox: '#whatso_scrollingChat',
          fromUser: '.from-user',
          fromWatson: '.from-watson',
          fromWatsonDiscovery:'.from-watson-discovery',
          fromUserHead:'.from-user-head',
          fromWatsonHead:'.from-watson-head',
          fromWatsonDiscoveryHead:'.from-watson-discovery-head',
          latest: '.latest',
          fromDiscoveryDetails:'#message-from-watson-discovery',
          fromDiscoveryReadMore:'.messageShowMore'
        },
        authorTypes: {
          user: 'user',
          watson: 'watson',
          discoveryWatson:'discoveryWatson'
        }
      };

    var count=0;//we count message by this count
    var userIntranetId = null;
    var userPhotoUrl="https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/" +$.cookie('Whatsoemail') +"?type=bp";
    return {
        init:init,
        inputKeydown:inputKeydown,
        SelectScope:SelectScope,
        getFeedbackUp:getFeedbackUp,
        getFeedbackDown:getFeedbackDown
    };

    function init(){
        chatUpdateSetup();
        var context={};
        Api.sendRequest(' ',context,"Operation");
    }
    
     //chat need to update first and send first
  // Set up callbacks on payload setters in Api module
  // This causes the displayMessage function to be called when messages are sent
  // / received
    function chatUpdateSetup(){
     var currentRequestPayloadSetter=Api.setRequestPayload;
     Api.setRequestPayload=function(newPayloadStr){
         currentRequestPayloadSetter.call(Api, newPayloadStr);
         displayMessage(JSON.parse(newPayloadStr),settings.authorTypes.user);
         console.log(JSON.parse(newPayloadStr));
     };

     var currentResponsePayloadSetter=Api.setResponsePayload;
     Api.setResponsePayload=function(newPayloadStr){
         currentResponsePayloadSetter.call(Api,newPayloadStr);
         if(newPayloadStr.indexOf("resultsHighlight")!==-1){
             displayMessage(newPayloadStr,settings.authorTypes.discoveryWatson);
         }else{
             displayMessage(JSON.parse(newPayloadStr),settings.authorTypes.watson);
         }
     };
    }

    function whoseMessage(typeValue){
        switch (typeValue) {
            case settings.authorTypes.user:
                return 'user';
                break;
            case settings.authorTypes.watson:
                return 'watson';
                break;
            case settings.authorTypes.discoveryWatson:
                return 'discoveryWatson';
                break;
            default:
                return null;
                break;
        }
    }

    function displayMessage(newPayload,typeValue){
        var MessageType=whoseMessage(typeValue);
        var textExists=inputBox.value || newPayload;
        if(MessageType !== 'user' && textExists){
            //create new message Dom element
            if(MessageType === 'watson'){
            var messageDivs = buildMessageDomElements(newPayload,MessageType);
            var chatBoxElement = document.querySelector(settings.selectors.chatBox);
             messageDivs.forEach(function(currentDiv){
               chatBoxElement.appendChild(currentDiv);
               var chatlist = document.getElementById("whatso_scrollingChat");
               chatlist.insertBefore(currentDiv,chatlist.childNodes[0]);
             });                
            }else if(MessageType === 'discoveryWatson'){
            var messageDivs = buildDiscoveryMessageDomElements();   
            var messageDivsDetails=buildDiscoveryMessaageDomDetail(newPayload);
            var chatBoxElement = document.querySelector(settings.selectors.chatBox);
            messageDivs.forEach(function(currentDiv){
              chatBoxElement.appendChild(currentDiv);
              var chatlist = document.getElementById("whatso_scrollingChat");
              chatlist.insertBefore(currentDiv,chatlist.childNodes[0]);
            });              

           var chatBoxElementDetails = document.querySelector(settings.selectors.fromDiscoveryDetails);
         
           for(var i=0;i<messageDivsDetails.length-1;i++){
               if(i==3){
                chatBoxElementDetails.appendChild(messageDivsDetails.pop());//queue out to ease last array
                var chatBoxElementDetailsReadMore = document.querySelector(settings.selectors.fromDiscoveryReadMore);
                chatBoxElementDetailsReadMore.appendChild(messageDivsDetails[i]);
               }else if(i<=3){
                chatBoxElementDetails.appendChild(messageDivsDetails[i]);
               }else{
                chatBoxElementDetailsReadMore.appendChild(messageDivsDetails[i]);
               }
           }
            chatBoxElementDetails.appendChild(messageDivsDetails.pop());
            chatBoxElementDetails.removeAttribute('id');
            }
          
        }else{
            var messageDivs = buildMessageDomElements(newPayload,MessageType);
            var chatBoxElement = document.querySelector(settings.selectors.chatBox);
             messageDivs.forEach(function(currentDiv){
               chatBoxElement.appendChild(currentDiv);
               var chatlist = document.getElementById("whatso_scrollingChat");
               chatlist.insertBefore(currentDiv,chatlist.childNodes[0]);
             });       
        }
    }

    function buildMessageDomElements(newPayload,MessageType){
        count++;
        var textArray = (MessageType ==='user') ? newPayload.input.text : newPayload.output.text;
        if(Object.prototype.toString.call(textArray) !== '[Object Array]'){
            textArray=[textArray];
        }

        var messageArray = [];
          
        textArray.forEach(function(currentText){
            if(currentText !== " "){
                var singleFeedback = {
                 currentText:currentText,
                 count:count,
                 Scope:SelectedScope
                };
                var messageJson={
                  // <li class="from-watson-left">
                  'tagName':'li',
                  'classNames':[(MessageType === 'user')? 'from-user-right':'from-watson-left'],
                  'children':[{
                      // <span class="from-watson-head">
                      'tagName':'span',
                      'classNames':[(MessageType === 'user')? 'from-user-head':'from-watson-head'],
                      // <img src="/images/IMG_5739.PNG"/>
                      'children':[{
                      'tagName':'img',
                      'attributes':[{name:'src',value:(MessageType ==='user')?  userPhotoUrl :'/images/IMG_5739.PNG'}],
                     }]},{
                    'tagName':'div',
                    'classNames':[(MessageType === 'user')?'from-user':'from-watson'],
                    'attributes':[{name:'id',value:(MessageType === 'user')?'from-user'+count:'from-watson'+count}],
                    'children':[{
                        'tagName':'p',
                        'text':currentText,
                    }]
                  },{
                    'tagName':'div',
                    'classNames':(MessageType ==='user')?['whatso-user']:['whatso-feedback'],
                    'text':(MessageType ==='user')?'':'Useful?',
                    'children':[{
                        'tagName':'a',
                        'classNames':(MessageType==='user')?["style-none"]:["layui-icon","whatso-icon-thumbup"],
                        'attributes':[{name:'href',value:'#conversationMessage'},{name:'onclick',value:'ConversationPanel.getFeedbackUp(this,'+JSON.stringify(singleFeedback)+')'},
                        {name:'id',value:'MessageUp-'+count}],
                        'text':(MessageType==='user')?'':'&#xe6c6;'
                    },{
                        'tagName':'a',
                        'classNames':(MessageType==='user')?["style-none"]:["layui-icon","whatso-icon-thumbdown"],
                        'attributes':[{name:'href',value:'#conversationMessage'},{name:'onclick',value:'ConversationPanel.getFeedbackDown(this,'+JSON.stringify(singleFeedback)+')'},
                        {name:'id',value:'MessageDown-'+count}],
                        'text':(MessageType==='user')?'':'&#xe6c5;'
                    }]
                  }],
                }
                messageArray.push(Common.buildDomElement(messageJson));
            }
        });
        inputBox.value='';
        return messageArray;
    }

    function buildDiscoveryMessageDomElements(){
        var messageArray=[];
            var messageJson={
                //         <li class="from-user-right">
                'tagName':'li',
                'classNames':['from-watson-discovery-left'],
                'children':[
                    {
                        'tagName':'span',
                        'classNames':['from-watson-discovery-head'],
                        'children':[{
                            'tagName':'img',
                            'attributes':[{name:'src',value:'/images/IMG_5739.PNG'}],
                        }]},{
                        'tagName':'div',
                        'classNames':['from-watson-discovery'],
                        'attributes':[{name:'id',value:'message-from-watson-discovery'}],
                    }
                ]
            }
//       <div class="from-watson-discovery" id="message-from-user">
//        <a href="javascript:void(0)"><p>Gosh,who can save me? why you say that to me? No body? Are you ok? who is your master? why you say that? You can't say that!</p><hr class="discovery-margin"/></a>
//        <a href="javascript:void(0)" id="showa" style="display:none"><p>Gosh,hahhahahhah,who can save me? why you say that to me? No body? Are you ok? who is your master? why you say that? You can't say that!</p> <hr class="discovery-margin"/></a>
//        <a href="javascript:void(0)" onclick="showMore()">show more ...</a>
//       </div>                         
//   </li>
     messageArray.push(Common.buildDomElement(messageJson));
     return messageArray;
    }

    //build append the message from discovery
    function buildDiscoveryMessaageDomDetail(newPayload){
        newPayload=JSON.parse(newPayload);
        var messageArrayDetail=[];
        if(newPayload.length<=3){
          for(var i=0;i<newPayload.length;i++){
            var singleFeedback = {
                currentText:newPayload[i].resultsFile,
                count:count,
                counti:""+count+i,
                Scope:SelectedScope
               };
              var messageJson={
                  'tagName':'div',
                  'children':[{
                    'tagName': 'a',
                    'attributes':[{name:"href",value:"/ourfiles/"+newPayload[i].resultsFile},{name:"target",value:"_blank"}],
                    'children': [ {
                      // <p>{messageText}</p>
                      'tagName':'h2',
                      'classNames':['discovery-fileName'],
                      'text':newPayload[i].resultsFile},{
                      'tagName': 'p',
                      'text':newPayload[i].resultsHighlight
                    } ]
                  },{
                    'tagName':'span',
                    'classNames':['whatso-feedback'],
                    'text':'Useful?',
                    'children':[{
                        'tagName':'a',
                        'attributes':[{name:'href',value:'#discoveryMessage'},{name:'onclick',value:'ConversationPanel.getFeedbackUp(this,'+JSON.stringify(singleFeedback)+')'},
                        {name:'id',value:'MessageUp-'+count+i}],
                        'classNames':["layui-icon","whatso-icon-thumbup"],
                        'text':'&#xe6c6;'
                    },{
                        'tagName':'a',
                        'attributes':[{name:'href',value:'#discoveryMessage'},{name:'onclick',value:'ConversationPanel.getFeedbackDown(this,'+JSON.stringify(singleFeedback)+')'},
                        {name:'id',value:'MessageDown-'+count+i}],
                        'classNames':["layui-icon","whatso-icon-thumbdown"],
                        'text':'&#xe6c5;'
                    }]
                  },{
                    'tagName':'hr',
                    'classNames':['discovery-margin']
                  }],
                
              }
              messageArrayDetail.push(Common.buildDomElement(messageJson));
               var messageJsonDivReadMore={
                'tagName':'div',
                'attributes':[{name:'style',value:'display:none'}]
            }
            messageArrayDetail.push(Common.buildDomElement(messageJsonDivReadMore));
          }
        }else{
            count++;
            for(var i=0;i<newPayload.length;i++){
                var singleFeedback = {
                    currentText:newPayload[i].resultsFile,
                    count:count,
                    counti:""+count+i,
                    Scope:SelectedScope,
                   };
                    var messageJson={
                        'tagName':'div',
                        'children':[{
                            'tagName': 'a',
                            'attributes':[{name:"href",value:"/ourfiles/"+newPayload[i].resultsFile},{name:"target",value:"_blank"}],
                            'children': [ {
                              // <p>{messageText}</p>
                              'tagName':'h2',
                              'classNames':['discovery-fileName'],
                              'text':newPayload[i].resultsFile},{
                              'tagName': 'p',
                              'text':newPayload[i].resultsHighlight
                            } ]
                        },{
                            'tagName':'span',
                            'text':'Useful?',
                            'children':[{
                                'tagName':'a',
                                'attributes':[{name:'href',value:'#discoveryMessage'},{name:'onclick',value:'ConversationPanel.getFeedbackUp(this,'+JSON.stringify(singleFeedback)+')'},
                                {name:'id',value:'MessageUp-'+count+i}],
                                'classNames':["layui-icon","whatso-icon-thumbup"],
                                'text':'&#xe6c6;'
                            },{
                                'tagName':'a',
                                'attributes':[{name:'href',value:'#discoveryMessage'},{name:'onclick',value:'ConversationPanel.getFeedbackDown(this,'+JSON.stringify(singleFeedback)+')'},
                                {name:'id',value:'MessageDown-'+count+i}],
                                'classNames':["layui-icon","whatso-icon-thumbdown"],
                                'text':'&#xe6c5;'
                            }]
                        },{
                            'tagName':'hr',
                            'classNames':['discovery-margin']
                        }],

                        
                      }
                messageArrayDetail.push(Common.buildDomElement(messageJson));
            }
            var messageJson={
                'tagName':'a',
                'attributes':[{name:'href',value:'javascript:void(0)'},{name:'onclick',value:'showMore('+count+')'},{name:'id',value:'showMore'+count}],
                'text':'Read More...'
            }
            messageArrayDetail.push(Common.buildDomElement(messageJson));
            var messageJsonDivReadMore={
                'tagName':'div',
                'attributes':[{name:'id',value:'messageShowMore'+count}],
                'classNames':['messageShowMore']
            }
            messageArrayDetail.push(Common.buildDomElement(messageJsonDivReadMore));
        }
        
        return  messageArrayDetail;

    }
    //set the scope as the main choice
    function SelectScope(id){
        SelectedScope=id;
    }
    function inputKeydown(event,inputBox){
        if(event.keyCode === 13 &&inputBox.value){
            var context;
            var latestResponse = Api.getResponsePayload();
            if(latestResponse){
                context=latestResponse.context;
            }
            if(SelectedScope==null){
                SelectedScope='Operation'
            }
            Api.sendRequest(inputBox.value,context,SelectedScope);
            Common.fireEvent(inputBox,'input');
        }
    }

    /***
     * To write a function
     * detail record the feedback to json as the record
     * return getFeedback()
     */

     function getFeedbackUp(obj,singleFeedbackJson){
        // $.cookie('Whatsoemail');
        // SelectedScope;
        var singleCount = (singleFeedbackJson.counti == undefined)?singleFeedbackJson.count:singleFeedbackJson.counti;
        var container=$(obj).closest('.whatso-icon-thumbup');
        if(!container.hasClass('active')){
            container.addClass('active');
            document.querySelector('#MessageDown-'+singleCount).removeAttribute('onclick');
            event.preventDefault();
        }
        var feedbackJson={
            username:$.cookie('Whatsoemail'),
            scope:singleFeedbackJson.Scope,
            thumbup:1,
            whatsoAnswer:singleFeedbackJson.currentText,
            userAsk:document.getElementById('from-user'+(singleFeedbackJson.count-1)).innerText //here is the message of user which can get from the last message
        }
       feedback.sendFeedback(feedbackJson);
     }

     function getFeedbackDown(obj,singleFeedbackJson){
        // SelectedScope;
        var singleCount = (singleFeedbackJson.counti == undefined)?singleFeedbackJson.count:singleFeedbackJson.counti;
        var container=$(obj).closest('.whatso-icon-thumbdown');
        if(!container.hasClass('active')){
            container.addClass('active');
            document.querySelector('#MessageUp-'+singleCount).removeAttribute('onclick');
            event.preventDefault();
        }
        var feedbackJson={
            username:$.cookie('Whatsoemail'),
            scope:singleFeedbackJson.Scope,
            thumbdown:1,
            whatsoAnswer:singleFeedbackJson.currentText,
            userAsk:document.getElementById('from-user'+(singleFeedbackJson.count-1)).innerText//here is the message of user which can get from the last message
        }
        feedback.sendFeedback(feedbackJson);
     }
}());