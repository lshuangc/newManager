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

    function dateFormat(time) {//重写日期格式
        var unixTimestamp = new Date(time);
        Date.prototype.toLocaleString = function () {
            var minutes = this.getMinutes() <= 10 ? "0" + this.getMinutes() : this.getMinutes();
            return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + minutes;
        };
        var commonTime = unixTimestamp.toLocaleString();
        return commonTime;
    }

    // 刷新页面
    $(".user .shuaxin").click(function(){
        $(".main .box").load("user.html");
    });


    //分页
    var page =1;
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
            user({page:page,rows:"5"});

        });

        // 下一页
        $(".paging .downPage").click(function(){
            totalPage = parseInt($(".user .paging").attr("data-totalPage"));
            if(totalPage!=0){
                if(page>=totalPage){
                    page=totalPage;
                }else{
                    page+=1;
                }
                $(".paging .nowPage").html(page);
                user({page:page,rows:"5"});
            }
        });

        // 跳页
        $(".paging .yes").click(function(){
            totalPage = parseInt($(".user .paging").attr("data-totalPage"));
            if($(".paging .jumpPage input").val()-0>=1&&$(".paging .jumpPage input").val()-0<=totalPage){
                page=$(".paging .jumpPage input").val()-0;
                $(".paging .nowPage").html(page);
                user({page:page,rows:"5"});
            }
        });
    }



    //点击出现身份证
    $(document).on("click", ".cardId", function () {
        if($(this).attr("data-idCardStatus")!="1"){

            var getOneById = $(this).attr("id");
            $(".zhezhao").show();
            $(".cardIdPopup").fadeIn(500);
            $.ajax({
                type: 'post',
                url: urlHead + "/user/getOneById",
                data: {
                    id: getOneById,
                },
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if (data.result == "1") {
                        $(".user .cardIdPopup ul li:nth-child(1) img").attr("src", urlImg + "/images/users/" + data.object.idCardImg1);
                        $(".user .cardIdPopup ul li:nth-child(2) img").attr("src", urlImg + "/images/users/" + data.object.idCardImg2);
                        $(".user .cardIdPopup ul li:nth-child(3) img").attr("src", urlImg + "/images/users/" + data.object.idCardImg3);
                        if (data.object.idCardStatus == "3") {
                            $(".user .cardIdPopup button").hide();
                        } else {
                            $(".user .cardIdPopup button").show();
                        }

                        //通过身份审核
                        $(document).on("click", ".userAdopt", function () {
                            // $(".zhezhao").show();
                            // $(".user .userAdoptShen").fadeIn(500);
                            $.ajax({
                                type: 'POST',
                                url: urlHead + "/user/updateToIdCardStatus",
                                data: {
                                    idCardStatus: 3,
                                    id: getOneById,
                                },
                                dataType: 'json',
                                success: function (data) {
                                    // $(".user .userAdoptShen").html("");
                                    //     $(".user .userAdoptShen").append(
                                    //         `<img class="img" src="img/chahao9.png"/>
                                    //         <span >确定要通过审核吗？</span>
                                    //         <button class="userAdopt">确定</button>
                                    //         <button class="userNoway">取消</button>`
                                    //     )

                                    $(".user .cardIdPopup").hide();
                                    $(".zhezhao").hide();
                                    user({page:page,rows:"5"});
                                },
                                error: function (data) {
                                    openPromptBox('网络错误!');
                                },
                            });
                        });
                        //驳回身份审核
                        $(document).on("click", ".userNoway", function () {
                            $.ajax({
                                type: 'POST',
                                url: urlHead + "/user/updateToIdCardStatus",
                                data: {
                                    idCardStatus: 4,
                                    id: getOneById,
                                },
                                dataType: 'json',
                                success: function (data) {
                                    $(".user .cardIdPopup").hide();
                                    $(".zhezhao").hide();
                                    user({page:page,rows:"5"});
                                },
                                error: function (data) {
                                    openPromptBox('网络错误!');
                                },
                            });
                        });
                    }else {
                        openPromptBox("获取数据失败");
                    }
                },
                error: function (data) {
                    openPromptBox('网络错误!');
                },
            });
        }
    });

    //点击出现银行卡
    $(document).on("click", ".bankCard", function () {
        if($(this).attr("data-banckcardStatus")!="1"){

            $(".zhezhao").show();
            $(".bankCardPopup").fadeIn(500);
            $.ajax({
                type: 'post',
                url: urlHead + "/Bankcard/findBankcards",
                data: {
                    userId: $(this).attr("id"),
                },
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: function (data) {
                    info = data.object;
                    if (data.result == "1") {
                        $(".user .bankCardPopup").html("");
                        for (var i = 0; i < info.length; i++) {
                            $(".user .bankCardPopup").append(
                                `<img class="img" src="img/chahao9.png"/>
                                    <h5>银行卡信息</h5>
                                    <ul>
                                    <li>
                                        <span class="span1">开户人姓名：</span>
                                        <span class="span2">${info[i].bankcardUsename}</span>
                                    </li>
                                    <li>
                                        <span class="span1">开户银行：</span>
                                        <span class="span2">${info[i].bankAddress}</span>
                                    </li>
                                    <li>
                                        <span class="span1">卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
                                        <span class="span2">${info[i].bankcardNumber}</span>
                                    </li>
                                    <li>
                                        <span class="span1">绑定时间：</span>
                                        <span class="span2">${dateFormat(info[i].bankAddtime)}</span>
                                    </li>
                                </ul>`
                            )
                        }
                    }
                },
                error: function (data) {
                    openPromptBox('网络错误!');
                },
            });
        }
    });

    //点击删除
    // $(document).on("click", ".userDelate", function () {
    //     $(".zhezhao").show();
    //     $(".delateUser").fadeIn(500);
    // });

    // 关闭按钮
    $(document).on("click", ".img", function () {
        $(".zhezhao").fadeOut();
        $(".cardIdPopup").fadeOut();
        $(".bankCardPopup").fadeOut();
        $(".delateUser").fadeOut();
    });

    //默认进页面加载数据列表
    user({page:"1",rows:"5"});
    function user(data) {
        $.ajax({
            type: 'post',
            url: urlHead + "/user/findToHouTai",
            data: data,
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {

                info = data.object.data;
                if (data.result == "1") {
                    $(".user .paging").attr("data-totalPage",Math.ceil(data.object.totalNumber/data.object.pageSize));

                    $(".user table tbody").html("");

                    for (var i = 0; i < info.length; i++) {
                        var idCardStatus = "";
                        switch (info[i].idCardStatus) {
                            case '1' :
                                idCardStatus = "身份未认证";
                                break;
                            case '2' :
                                idCardStatus = "身份证信息已提交，待审核";
                                break;
                            case '3' :
                                idCardStatus = "已实名认证";
                                break;
                            default:
                                idCardStatus = "审核不通过";
                        }
                        var banckcardStatus = "";
                        switch (info[i].banckcardStatus) {
                            case '1' :
                                banckcardStatus = "银行卡未绑定";
                                $(".bankCard").removeAttr("onclick");
                                break;
                            default:
                                banckcardStatus = "银行卡已绑定";
                        }
                        $(".user table tbody").append(
                            `<tr data-id="">
                                <td>${ (i + 1)}</td>
                                <td>${ info[i].realName}</td>
                                <td>${ info[i].idCardNumber}</td>
                                <td class="cardId" id="${ info[i].id}" data-idCardStatus="${info[i].idCardStatus}">${ idCardStatus}</td>
                                <td>${ info[i].userPhone}</td>
                                <td class="bankCard"  id="${ info[i].id}" data-banckcardStatus="${info[i].banckcardStatus}">${ banckcardStatus}</td>
                                <td>${ info[i].userCustomernumbers}</td>
                                <td>${dateFormat(info[i].registerTime.time) }</td>
                                <td>${dateFormat(info[i].userCurrentLogintime.time) }</td>
                                <!--<td ><a href="javascript:;" class="userDelate">删除</a> </td>-->
                            </tr>`
                        )
                    }
                }else {
                    openPromptBox("获取数据失败");
                }
            },
            error: function (data) {
                openPromptBox('网络错误!');
            },
        });
    }
});