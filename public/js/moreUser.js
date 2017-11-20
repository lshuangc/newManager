$(function () {
    //弹出提示框
    function openPromptBox(str) {
        $(".promptBox").show();
        $(".promptBox p").html(str);
        $(".zhezhao").show();
    }

    //关闭提示框
    $(".promptBox img").click(function(){
        $(".promptBox").hide();
        $(".zhezhao").hide();
        $(".zhezhao").css("z-index","800");
    });


    function dateFormat(time) {
        var unixTimestamp = new Date(time);
        Date.prototype.toLocaleString = function () {
            var minutes = this.getMinutes() <= 10 ? "0" + this.getMinutes() : this.getMinutes();
            return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + minutes;
        };
        var commonTime = unixTimestamp.toLocaleString();
        return commonTime;
    }

    // 刷新页面
    $(".moreUser .shuaxin").click(function(){
        $(".main .box").load("moreUser.html");
    });

    var page =1;

    //点击添加
    $(".moreUser .add").click(function () {
        $(".moreUser .moreUserAdd").fadeIn();
        $(".zhezhao").show();
        $(document).on("click",".moreUser .moreUserAdd .moreUserAdopt",function () {
            if(!$(".moreUserAdd .adminName").val() || !$(".moreUserAdd .phone").val() || !$(".moreUserAdd .password").val()){
                //alert("请填写完整后提交");
                return;
            }
            $.ajax({
                url: urlHead + "/admin/addAdmin",
                type: 'post',
                dataType: 'json',
                data: {
                    adminName:$(".moreUserAdd .adminName").val(),
                    phone:$(".moreUserAdd .phone").val(),
                    email:$(".moreUserAdd .email").val(),
                    password:$(".moreUserAdd .password").val(),
                    adminRole:$(".moreUserAdd .adminRole").val(),
                },
                xhrFields: {withCredentials: true},
                success: function (data) {
                    openPromptBox("添加成功");
                    $(".moreUser .moreUserAdd").hide();
                    $(".zhezhao").hide();

                    moreUser({page:"1",rows:"10"});
                    page=1;
                }
            });
        })
    });

    //点击修改密码的弹出框
    $(document).on("click",".moreUser .moreUserUpdata",function () {
        $(".moreUser .updataPopup").fadeIn();
        $(".zhezhao").fadeIn();
        var phone = $(this).attr("data-phone");

        var time=60;
        var timer=null;
        //点击发送验证码
        $(document).on("click",".moreUser .updataPopup .verification",function () {
            $(".moreUser .updataPopup .yanzheng").val()=="";
            $(".moreUser .updataPopup .password").val()=="";
            $(".moreUser .updataPopup .queren").val()=="";

            if($(".moreUser .updataPopup .verification").text()=="发送验证码") {

                $(".moreUser .updataPopup .verification").html(60);
                $(".moreUser .updataPopup .verification").css("background-color", "#d5d5d5");
                timer = setInterval(function () {
                    time = time - 1;
                    $(".moreUser .updataPopup .verification").html(time);
                    if (time == 0) {
                        clearInterval(timer);
                        $(".moreUser .updataPopup .verification").css("background-color", "#5a98de");
                        $(".moreUser .updataPopup .verification").html("发送验证码");
                        time = 60;
                    }
                }, 1000);
                $.ajax({
                    url: urlHead + "/admin/updateAdminPwdConfirm",
                    type: 'post',
                    dataType: 'json',
                    data: {
                        phone:phone,
                    },
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        // alert("发送成功");
                    }
                });
            }
        });

        //点击修改按钮
        $(document).on("click",".moreUser .updataPopup .moreUserAdopt",function () {
            if(!$(".updataPopup .adminName").val() || !$(".updataPopup .phone").val() || !$(".updataPopup .password").val()){
                openPromptBox("请填写完整后提交");
                return;
            }
            $.ajax({
                url: urlHead + "/admin/updateAdminPwd",
                type: 'post',
                dataType: 'json',
                data: {
                    password:$(".updataPopup .password").val(),
                    phone:phone,
                    random:$(".yanzheng").val(),
                },
                xhrFields: {withCredentials: true},
                success: function (data) {
                    openPromptBox("添加成功");
                    $(".moreUser .moreUserAdd").hide();
                    $(".zhezhao").hide();

                    moreUser({page:"1",rows:"10"});
                    page=1;
                    $(".moreUser .updataPopup").fadeOut();
                    $(".zhezhao").fadeOut();
                    moreUser({page:"1",rows:"99"});
                }
            });
        })
    });

    //点击删除
    $(document).on("click",".moreUser .moreUserDelate",function () {
        $(".moreUser .delateMoreUser").fadeIn();
        $(".zhezhao").show();
        moreUser({page:"1",rows:"10"});
        page=1;
        $(".zhezhao").fadeIn();
        // moreUser({page:"1",rows:"99"});
        // page=1;
        var moreUserId = $(this).attr("data-moreUserId");

        $(document).on("click",".moreUser .delateMoreUser .moreUserAdopt",function () {
            $.ajax({
                url: urlHead + "/admin/deleteAdmin",
                type: 'post',
                dataType: 'json',
                data: {
                    id:moreUserId,
                },
                xhrFields: {withCredentials: true},
                success: function (data) {
                    $(".moreUser .delateMoreUser").hide();
                    $(".zhezhao").hide();
                    moreUser({page:"1",rows:"99"});
                }
            });

        })
    });

    // 点击关闭
    $(".moreUser img , .moreUser .moreUserNoway").click(function () {
        $(".moreUser .delateMoreUser").fadeOut();
        $(".moreUser .moreUserAdd").fadeOut();
        $(".moreUser .updataPopup").fadeOut();
        $(".zhezhao").fadeOut();
    });

    moreUser({page:"1",rows:"10"});
    function moreUser(data) {
        $.ajax({
            url: urlHead + "/admin/getAdminsBypage",
            type: 'post',
            dataType: 'json',
            data: data,
            xhrFields: {withCredentials: true},
            success: function (data) {
                $(".moreUser tbody").html("");
                if (data.result == "1") {
                    $(".moreUser .paging").attr("data-totalPage",Math.ceil(data.object.totalNumber/data.object.pageSize));
                    info = data.object.data;
                    var tag = "";
                    for (var i = 0; i < info.length; i++) {
                        var adminRole = info[i].adminRole == '1' ? adminRole = "超级管理员" : adminRole = "普通管理员";
                        tag += `<tr>
                                    <td>${ (i + 1) }</td>
                                    <td>${ info[i].adminName}</td>
                                    <td>${ info[i].phone}</td>
                                    <td>${ info[i].email}</td>
                                    <td>${ adminRole }</td>
                                    <td>${dateFormat(info[i].addTime.time)}</td>
                                    <td>${dateFormat(info[i].addTime.time)}</td>
                                    <td  class="do" style="display: ${adminRemarks=='1' ? 'block' : 'none'}">                    
                                         <button class="moreUserUpdata" style="display:${info[i].id==adminId ? '' : 'none'}" data-phone="${ info[i].phone}">修改密码</button>
                                         <button class="moreUserDelate" data-moreUserId="${ info[i].id}">删除</button>
                                    </td>     
                                    <td  class="do" style="display: ${adminRemarks=='0' ? 'block' : 'none'}">                    
                                         <button class="moreUserUpdata" style="display:${info[i].id==adminId ? '' : 'none'}" data-phone="${ info[i].phone}">修改密码</button>
                                         <button class="" >  </button>
                                    </td>                             
                                </tr>`;
                    }
                    $("tbody").html(tag);
                }else {
                    openPromptBox("获取数据失败");
                }
            },
            error: function (data) {
                openPromptBox('网络错误!');
            },
        });
    }

    var open2=false;
//	正则匹配6位短信验证码
    $(document).on("input propertychange",'.updataPopup .yanzheng',function(){
        var re=/^\d{6}$/;
        var str=$(this).val();
        if(re.test(str)){
            open2=true;
            $(".moreUser .updataPopup ul li .tips").css("display","none");
        }else{
            open2=false;
            $(".moreUser .updataPopup ul li .tips").css("display","block").text("验证码错误");
        }
    });
    //判断2次密码是否一样
    $(document).on("input propertychange",'.updataPopup .queren',function(){
        if ($(".updataPopup .queren").val() == "") {
            $(".moreUser .updataPopup ul li .tips").css("display","block").text("请确认密码");
            return;
        }
        if ($(".updataPopup .queren").val() != $(".updataPopup .password").val()) {
            $(".moreUser .updataPopup ul li .tips").css("display","block").text("两次密码不一致");
            return;
        }
        $(".moreUser .updataPopup ul li .tips").css("display","none");
    });

    yanzheng(".moreUser  .adminName", /^[\u4E00-\u9FA5]{2,6}$/);
    yanzheng(".moreUser  .phone", /^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])\d{8}$/);
    yanzheng(".moreUser  .password", /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/);
    yanzheng(".moreUser  .email", /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
    yanzheng(".moreUser .updataPopup .queren", /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/);
    yanzheng(".moreUser .updataPopup .yanzheng", /^\d{6}$/);

    paging();
    function paging() {
        var totalPage =1;
        // 上一页
        $(".paging .upPage").click(function(){
            if(page<=1){
                page=1;
            }else{
                page-=1;
            }
            $('.paging .nowPage').html(page);
            moreUser({page:page,rows:"10"});

        });

        // 下一页
        $(".paging .downPage").click(function(){
            totalPage = parseInt($(".moreUser .paging").attr("data-totalPage"));
            if(totalPage!=0){
                if(page>=totalPage){
                    page=totalPage;
                }else{
                    page+=1;
                }
                $(".paging .nowPage").html(page);
                moreUser({page:page,rows:"10"});
            }
        });

        // 跳页
        $(".paging .yes").click(function(){
            totalPage = parseInt($(".moreUser .paging").attr("data-totalPage"));
            if($(".paging .jumpPage input").val()-0>=1&&$(".paging .jumpPage input").val()-0<=totalPage){
                page=$(".paging .jumpPage input").val()-0;
                $(".paging .nowPage").html(page);
                moreUser({page:page,rows:"10"});
            }
        });
    }

    //正则验证函数
    function yanzheng(name, zhengze) {
        // 失去焦点
        $(name).blur(function () {
            var re = zhengze;
            var str = $(this).val();
            if (re.test(str)) {
                $(this).removeClass("redBorder");
                $(this).attr("data-boolean", "true");
            } else {
                $(this).addClass("redBorder");
                $(this).attr("data-boolean", "false");
            }
        });
        // 获取焦点
        $(name).focus(function () {
            $(this).removeClass("redBorder");
        });
    }


    var adminId = "";
    console.log(adminId)
    var adminRemarks = "";
    isLogin(pageName());
    // 判断是否登录以及权限
     function isLogin(url) {
        var result = false;
        $.ajax({
            type: 'post',
            url: urlHead + "/admin/isLogin",
            async: false,
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: function (json) {
                if (json.result != "1") {
                    window.parent.location.reload();
                    window.location.href = './login.html';
                } else {
                    if (url) {
                         adminRemarks = json.object.adminRole;
                        adminId = json.object.id;
                        // console.log(adminId);
                        switch (url) {
                            case 'admin-list.html':
                                if (adminRemarks == '1') {
                                    result = true;
                                } else {
                                    window.location.href = './login.html';
                                }
                                break;
                        }
                    }
                }
            },
            error: function () {
                layer.msg('网络错误', {icon: 1, time: 1000});
            },
        });
        return result;
    };
     function pageName() {
        var strUrl = location.href;
        var arrUrl = strUrl.split("/");
        var strPage = arrUrl[arrUrl.length - 1];
        return strPage;
    };
});