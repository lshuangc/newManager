$(function () {
    function tishi(str) {
        $(".tishi").show();
        $(".tishi p").html(str);
        $(".zhezhao1").show();
    }

    //关闭提示框
    $(".tishi img").click(function(){
        $(".tishi").hide();
        $(".zhezhao1").hide();
    });



    $("#submit").click(function () {
        if (!$("#name").val() || !$("#password").val()) {
            tishi("用户名或密码不能为空！");
            return;
        }
        $.ajax({
            url: urlHead + "/admin/login",
            type: 'post',
            dataType: 'json',
            data: {
                adminName: $("#name").val(),
                password: $("#password").val()
            },
            xhrFields: {withCredentials: true},
            success: function (data) {
                if (data.result != "1") {
                    tishi("用户名或密码不正确！");
                    return;
                } else {
                    tishi("登陆成功！");
                    localStorage.setItem("login-userPhone", $("#name").val());

                    if ($("#online").attr("data-type") == "1") {
                        localStorage.setItem("login-userPassWord", $("#password").val());
                    } else {
                        localStorage.setItem("login-userPassWord", "");
                    }
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    },1000);

                }
            },
            error: function (data) {
                tishi("网络错误！");
            },
        });
    });

    //获取并验证记住的账号密码
    $("#name").val(localStorage.getItem("login-userPhone"));
    $("#password").val(localStorage.getItem("login-userPassWord"));

    if ($("#password").val()) {
        $("#online").attr("data-type", "1");
        $("#online").prop("checked", "checked");
    } else {
        $("#online").attr("data-type", "2");
        $("#online").prop("checked", "");
    }

    // 是否记住密码
    $("#online").click(function () {
        if ($(this).attr("data-type") == "2") {
            $(this).attr("data-type", "1");
        } else if ($(this).attr("data-type") == "1") {
            $(this).attr("data-type", "2");
        }
    });


    $("body").keydown(function () {
        if (event.keyCode == 13) {
            document.getElementById("submit").click();
        }
    })
})