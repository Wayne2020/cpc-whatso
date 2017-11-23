$(function(){
    $('#whatso_signin').on('click',function(){
    var intranetId = document.getElementById("whatso_intranetid").value;
    var password = document.getElementById("whatso_password").value;
    vailRemember();
        var info={"intranetId":intranetId,"password":password};
        $.ajax({
            type:'post',
            url:'/index',
            data:info,
            success:function(response,status,xhr){
                window.location.href=response.url;
            },
            error:function(data,error){
                alert("wrong password or account");
            }
        });
    });
    return false;
});
function vailRemember(){
    if($("#saveCookie").prop("checked")){
       $.cookie("rmbUser","true",{expires:7});
       $.cookie("Whatsopassword",document.getElementById('whatso_password').value,{expires:7});
    }else {
　　　　$.cookie("rmbUser", "false", { expire: -1 });
　　　  $.cookie("Whatsoemail",document.getElementById('whatso_intranetid').value,{expires:7});
　　　　$.cookie("Whatsopassword", "", { expires: -1 });
　　}
    }
        $().ready(function(){
　　　　//获取cookie的值
　　　　var username = $.cookie('Whatsoemail');
　　　　var password = $.cookie('Whatsopassword');

　　　　//将获取的值填充入输入框中
　　　　$('#whatso_intranetid').val(username);
　　　　$('#whatso_password').val(password);
　　　　if(username != null && username != '' && password != null && password != ''){//选中保存秘密的复选框
　　　　　　$("#saveCookie").attr('checked',true);
　　　}
});

$().ready(function(){
    $('#login_form').validate({
        rules:{
            whatso_intranetid:"required",
            whatso_password:"required"
        },
        messages:{
            whatso_intranetid:"please enter a valid IntranetId"
        }
    });
});