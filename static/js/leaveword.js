$(function () {
    changePic();
    //SetEmailVal();
    $("#leaveword").submit(function () {
        var title = $("#leaveword_title").val();
        title = $.trim(title);
        var content = $("#leaveword_content").val();
        content=$.trim(content);
        var email = $("#txtemail").val();
        email = $.trim(email);
        var captcha = $("#txtcode").val();
        captcha = $.trim(captcha);
        if (title.length == 0) {
            alert("请输入留言标题");
            $("#leaveword_title").focus();
            return false;
        }
        if (title.length > 200) {
            alert("留言标题最长支持200个字符");
            $("#leaveword_title").focus();
            return false;
        }
        if (content.length == 0) {
            alert("请输入留言内容");
            $("#leaveword_content").focus();
            return false;
        }
        if (content.length > 2000) {
            alert("留言内容最长支持2000个字符");
            $("#leaveword_content").focus();
            return false;
        }

        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) == false) {
            alert("邮箱格式不正确，请重新填写");
            $("#txtemail").focus();
            return false;
        }
        if (captcha.length == 0) {
            alert("请输入验证码");
            $("#txtcode").focus();
            return false;
        }

        if ($(this).valid()) {
            $.ajax({
                //cache: false,
                url: "/CompareValidCode",
                data: { validCode: $("#txtcode").val(), sval: "lyyz" },
                dataType: "json",
                type: 'post',
                success: function(data) {
                    if (data) {
                        $("#leaveword").ajaxSubmit({
                            url: "/InsertLeaveWord",
                            dataType: "json",
                            type: "post",
                            success: function(data) {
                                if (data.isSuccess) {
                                    alert(data.successMsg);
                                    changePic();
                                    cancel();
                                } else {
                                    alert(data.errorMsg);
                                    changePic();
                                    return;
                                }
                            },
                            error: function(XmlHttpRequest, textStatus, errorThrown) {
                                changePic();
                                alert('提交失败,标题或内容过长');
                            }
                        });
                    } else {
                        alert('验证码错误!');
                        changePic();
                    }
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        return false;
    });
});

function SetEmailVal() {
    $.ajax({
        cache: false,
        url: "/Customer/GetCustomerEmail",
        dataType: "json",
        type: 'post',
        success: function (data) {
            if (data != "")
            {
                $("#txtemail").val(data);
            }
        }
    });
}

function changePic() {
    var path = '/Customer/GenerateValidCode' + "?time=" + (new Date()).toLocaleTimeString() + "&sval=lyyz";
    $("#vpic").attr("src", path);
}

function cancel() {
    $("#leaveword").find(".u_textarea").val("");
    $("#leaveword").find(".u_input").val("");
    $("#leaveword").find("#leaveword_title").val('');
    $("#leaveword").find("#leaveword_content").val('');
    $("#leaveword").find("#txtemail").val('');
    $("#leaveword").find("#txtcode").val('');
    
}