// The Common module is designed as an auxiliary module
// to hold functions that are used in multiple other modules
/* eslint no-unused-vars: "off" */

var Common = (function(){
return {
    buildDomElement: buildDomElementFromJson,
    fireEvent: fireEvent,
    listForEach : listForEach
};

function buildDomElementFromJson(domJson){
    var element = document.createElement(domJson.tagName);
    
    if(domJson.text){
        element.innerHTML = domJson.text;
    }

    if(domJson.classNames){
        for(var i=0;i<domJson.classNames.length;i++){
            element.classList.add(domJson.classNames[i]);
        }
    }

    if(domJson.attributes){
        for(var j = 0;j<domJson.attributes.length;j++){
            var currentAttribute = domJson.attributes[j];
            element.setAttribute(currentAttribute.name,currentAttribute.value);
        }
    }

    if(domJson.children){
        for(var k=0; k<domJson.children.length;k++){
           var currentChild = domJson.children[k];
           element.appendChild(buildDomElementFromJson(currentChild));
        }
    }
        return element;
}
      // Trigger an event to fire
  function fireEvent(element, event) {
    var evt;
    if (document.createEventObject) {
      // dispatch for IE
      evt = document.createEventObject();
      return element.fireEvent('on' + event, evt);
    }
    // otherwise, dispatch for Firefox, Chrome + others
    evt = document.createEvent('HTMLEvents');
    evt.initEvent(event, true, true); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }

  // A function that runs a for each loop on a List, running the callback
  // function for each one
  function listForEach(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback.call(null, list[i]);
    }
  }
}());