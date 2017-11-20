$(function(){
    // 点击设置
    $("header .set").click(function () {
        if($(this).attr("data-num")=="1"){
            $(this).attr("data-num","2");
            $("header .set_box").show();
            $("header .set_box li").stop().animate({height:"40px" },400);
        }else{
            $(this).attr("data-num","1");
            $("header .set_box").fadeOut(300);
            $("header .set_box li").stop().animate({height:"0px" },300);
        }
    });

    // 多用户管理
    $("header .set_box .li1").click(function () {
        $("header .set").attr("data-num","1");
        $("header .set_box").fadeOut(300);
        $("header .set_box li").stop().animate({height:"0px" },300);
        $(".main .box").load("moreUser.html");
        $(".nav>li").css("background-color","#666666");
        $(".nav .object li,.nav .recomment li").css("background-color","#a1a1a1");
    });


    // 提示框
    function promptBox(str) {
        $(".promptBox").show();
        $(".promptBox p").html(str);
        $(".zhezhao").show();
    }



    // 点击样式
    $(".nav>.li3,.nav>.li4,.nav>.li5").click(function () {
        $(".nav>li").css("background-color","#666666");
        $(".nav .object li,.nav .recomment li").css("background-color","#a1a1a1");
        $(this).css("background-color","#5a98de");
    });

    //点击退出登录
    $("header ul li:last-child").click(function () {
        $("header .set").attr("data-num","1");
        $(".SignOut").fadeIn();
        $(".zhezhao").show();
        $("header ul").fadeOut();
        $(document).on("click",".SignOut .moreUserAdopt",function () {
            $(".SignOut").hide();
            $.ajax({
                url: urlHead + "/admin/logout",
                type: 'post',
                dataType: 'json',
                data: {},
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if (data.result == "1") {
                        promptBox("已退出登录！");
                        setTimeout(function () {
                            window.location.href = "login.html";
                        },1000);
                    }else{
                        promptBox("退出登录失败！");
                    }
                },
                error: function (data) {
                    promptBox("网络错误！");
                },
            })
        })
    });

    //点击关闭登录框
    $(".SignOut img , .SignOut .moreUserNoway").click(function () {
        $(".SignOut").fadeOut(300);
        $(".zhezhao").hide();
    });

    $(".nav .object li,.nav .recomment li").click(function () {
        $(".nav>li").css("background-color","#666666");
        $(".nav .object li,.nav .recomment li").css("background-color","#a1a1a1");
        $(this).css("background-color","#5a98de");
    });



    $(".nav .li1").click(function () {
        if($(this).attr("data-num")=="1"){
            $(this).attr("data-num","2");
            $(".nav .object").show();
            $(".nav .object").stop().animate({height:"80px" },300);
            $(".nav .object li").stop().animate({height:"30px" },400);
        }else{
            $(this).attr("data-num","1");
            $(".nav .object").fadeOut(400);
            $(".nav .object").stop().animate({height:"0px" },400);
            $(".nav .object li").stop().animate({height:"0px" },300);
        }
    });

    $(".nav .object li:first-child").click(function () {
        $(".main .box").load("insideProject.html");
        $('.zhezhao').hide();
        $('.zhezhao').css("z-index","800");
    });

    $(".nav .li2").click(function () {
        if($(this).attr("data-num")=="1"){
            $(this).attr("data-num","2");
            $(".nav .recomment").show();
            $(".nav .recomment").stop().animate({height:"80px" },300);
            $(".nav .recomment li").stop().animate({height:"30px" },400);
        }else{
            $(this).attr("data-num","1");
            $(".nav .recomment").fadeOut(400);
            $(".nav .recomment").stop().animate({height:"0px" },400);
            $(".nav .recomment li").stop().animate({height:"0px" },300);
        }
    });

    $(".nav .recomment li").eq(0).click(function(){
        $('.main .box').load('recommendNew.html');
        $('.zhezhao').hide();
        $('.zhezhao').css("z-index","800");
    });

    $(".nav .li3").click(function () {
        $(".main .box").load("user.html");
        $('.zhezhao').hide();
        $('.zhezhao').css("z-index","800");
    });

    $(".nav .li4").click(function () {
        $(".main .box").load("seller.html");
        $('.zhezhao').hide();
        $('.zhezhao').css("z-index","800");
    });

    $(".nav .li5").click(function () {
        $(".main .box").load("property.html");
        $('.zhezhao').hide();
        $('.zhezhao').css("z-index","800");
    });


});

