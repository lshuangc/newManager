$(function () {
    // 刷新页面
    $(".recommendNew .shuaxin").click(function(){
        $(".main .box").load("recommendNew.html");
    });


    // 点击导航栏
    $(".recommendNew .r_header li").click(function () {
        $(this).css("background-color","#5a98de");
        $(this).siblings().css("background-color","#a1a1a1");
        $(".recommendNew .r_header").attr("data-recommendProcess",$(this).attr("data-recommendProcess"));

        recommendNewList({recommendProcess:$(".recommendNew .r_header").attr("data-recommendProcess"),page:"1",rows:"10"});
    });

    // 详情弹出框
    $(document).on("click",".recommendNew .r_body tbody tr",function(){
        $('.zhezhao').show();
        $('.recommendNew .prompt1').show();
        $('.recommendNew .prompt1').attr("data-id",$(this).attr("data-id"));

        recommendNewDetails({recordId:$('.recommendNew .prompt1').attr("data-id")});
        recommendNewDateType({recordId:$('.recommendNew .prompt1').attr("data-id")});
    });
    $(document).on("click",".recommendNew .prompt1 .close1",function(){
        $('.zhezhao').hide();
        $('.recommendNew .prompt1').hide();
        $(".recommendNew .detailsXinXi .li14 input").removeClass("redBorder");
    });

    // 详情图片预览框
    $(document).on("click",".recommendNew .prompt1 .r_b li>img",function(){
        $('.zhezhao').css("z-index","900");
        $('.recommendNew .prompt2').show();
        $('.recommendNew .prompt2 .yulan').attr("src",$(this).attr("src"));
    });

    $(document).on("click",".recommendNew .prompt2 .close2",function(){
        $('.zhezhao').css("z-index","800");
        $('.recommendNew .prompt2').hide();
    });


   var page=1;
    recommendNewList({recommendProcess:"",page:"1",rows:"10"});
    //请求推荐单列表---------------------
    function recommendNewList(data){
        $.ajax({
            type: 'post',
            url: urlHead + "/recommendRecord/houtaiByCommunity",
            data: data,
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {
                $(".r_body table tbody").html("");

                msg=data.object.data;
                if (data.result=="1") {
                    $(".recommendNew .paging").attr("totalPage",Math.ceil(data.object.totalNumber/data.object.pageSize));

                    for (var i = 0; i < msg.length; i++) {
                        $(".r_body table tbody").append("<tr data-id='" + msg[i].id + "'>"+
                            "<td>"+i+"</td>"+
                            "<td>"+msg[i].realUserName+"</td>"+
                            "<td>"+msg[i].realUserPhone+"</td>"+
                            "<td>"+msg[i].recommendProjectName+"</td>"+
                            "<td>"+msg[i].recommendUserName+"</td>"+
                            "<td>"+msg[i].recommendUserPhone+"</td>"+
                            "<td>"+new Date(parseInt(msg[i].recommendAddTime.time)).toISOString().slice(0, 10)+"</td>"+
                            "<td>"+recomType(msg[i].recommendStatus,msg[i].recommendFlow,msg[i].sellersUserId)+"</td>"+
                        "</tr>")
                    }
                }
            }
        })
    }

    //查询推荐单状态
    function recomType(status,flow,sellersUserId){
        if(status=="1"){
            if(flow=="1"){
                return "推荐单生成";
            }else if(flow=="2"){
                return "我方审核通过推荐单";
            }else if(flow=="3"){
                if(sellersUserId=="0"){
                    return "甲方确认为有效推荐";
                }else{
                    return "甲方开始接待看房";
                }
            }else if(flow=="4"){
                return "客户已看房，等待推荐人上传看房确认单";
            }else if(flow=="5"){
                return "推荐人已上传看房确认单，等待我方审核";
            }else if(flow=="6"){
                return "我方通过看房确认单，等待推荐人上传购房合同";
            }else if(flow=="7"){
                return "推荐人已上传购房合同，等待我方审核，填写成交金额和应付佣金";
            }else if(flow=="8"){
                return "等待甲方审核购房合同";
            }else if(flow=="9"){
                return "甲方承认购房合同，等待我方确认实付佣金";
            }else if(flow=="905"){
                return "甲方未通过审核，回退等待运营复核";
            }else if(flow=="10"){
                return "交易完成";
            }
        }else if(status=="2"){
            if(flow=="1"){
                return "我方驳回推荐单";
            }else if(flow=="2"){
                return "甲方驳回推荐单";
            }
        }else if(status=="3"){
            return "已成交";
        }else if(status=="4"){
            return "已结佣";
        }
    }

    //分页查询列表
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
            recommendNewList({recommendProcess:$(".recommendNew .r_header").attr("data-recommendProcess"),page:page,rows:"10"});
        });

        // 下一页
        $(".paging .downPage").click(function(){
            totalPage = parseInt($(".recommendNew .paging").attr("data-totalPage"));

            if(totalPage!=0){
                if(page>=totalPage){
                    page=totalPage;
                }else{
                    page+=1;
                }
                $(".paging .nowPage").html(page);
                recommendNewList({recommendProcess:$(".recommendNew .r_header").attr("data-recommendProcess"),page:page,rows:"10"});
            }
        });

        // 跳页
        $(".paging .yes").click(function(){
            totalPage = parseInt($(".recommendNew .paging").attr("data-totalPage"));

            if($(".paging .jumpPage input").val()-0>=1&&$(".paging .jumpPage input").val()-0<=totalPage){
                page=$(".paging .jumpPage input").val()-0;
                $(".paging .nowPage").html(page);
                recommendNewList({recommendProcess:$(".recommendNew .r_header").attr("data-recommendProcess"),page:page,rows:"10"});
            }
        });
    }



    //请求推荐单状态和时间---------------------
    function recommendNewDateType(data){
        $.ajax({
            type: 'post',
            url: urlHead + "/RecommendDetail/findRecommendDetail",
            data: data,
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {

                $(".r_status ul").html("");
                for (var i = data.length-1; i >=0; i--) {
                    $(".r_status ul").append("<li>"+
                        "<span>"+new Date(parseInt(data[i].handleTime.time)).toISOString().slice(0, 10)+"</span>"+
                        "<span>"+data[i].managerProcess+"</span>"+
                    "</li>")
                }
            }
        })
    }


    //请求推荐单详情信息---------------------
    function recommendNewDetails(data){
        $.ajax({
            type: 'post',
            url: urlHead + "/recommendRecord/findById",
            data: data,
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {

                msg=data.object;
                if (data.result == "1") {
                    $(".detailsXinXi .li1 .span2").html(msg.userName);
                    $(".detailsXinXi .li2 .span2").html(msg.userPhone);
                    $(".detailsXinXi .li3 .span2").html(msg.realUserName);
                    $(".detailsXinXi .li4 .span2").html(msg.realUserPhone);
                    $(".detailsXinXi .li5 .span2").html(recommendProjectType(msg.recommendProjectType));
                    $(".detailsXinXi .li6 .span2").html(msg.recommendProjectName);
                    $(".detailsXinXi .li7 .span2").html(msg.recommendProjectAddress);
                    $(".detailsXinXi .li8 .span2").html(msg.recommendDescr);
                    $(".detailsXinXi .li9 .span2").html(new Date(parseInt(msg.recommendAddTime.time)).toISOString().slice(0, 10));
                    $(".detailsXinXi .li10 .span2").html(msg.sellersUserName);
                    $(".detailsXinXi .li11 .span2").html(msg.sellersUserPhone);
                    $(".detailsXinXi .li12 .span2").html(msg.contractMoney);
                    $(".detailsXinXi .li13 .span2").html(msg.makeMoney);
                    $(".detailsXinXi .li14 input").val(msg.recommendSendmoney);


                    if(msg.approveReceive!=""){
                        $(".prompt1 .r_b .li1 .img1").attr("src",urlImg + '/images/recommend/' + msg.approveReceive);
                    }else{
                        $(".prompt1 .r_b .li1 .img1").attr("src","img/fujian1.png");
                    }

                    if(msg.approveBuyhouse!=""){
                        $(".prompt1 .r_b .li2 .img2").attr("src",urlImg + '/images/recommend/' + msg.approveBuyhouse);
                    }else{
                        $(".prompt1 .r_b .li2 .img2").attr("src","img/fujian1.png");
                    }

                    if(msg.approveBill!=""){
                        $(".prompt1 .r_b .li2 .img3").attr("src",urlImg + '/images/recommend/' + msg.approveBill);
                    }else{
                        $(".prompt1 .r_b .li2 .img3").attr("src","img/fujian1.png");
                    }



                    if(msg.recommendStatus=="1"&&msg.recommendFlow=="1"){
                        $(".recommendNew .prompt1 .shenhe").show();
                        $(".recommendNew .r_b .li1 p").hide();
                        $(".recommendNew .r_b .li2 p").hide();
                        $(".recommendNew .prompt1 .li14 #paidBtn").hide();

                    }else if(msg.recommendStatus=="1"&&msg.recommendFlow=="5"){
                        $(".recommendNew .prompt1 .shenhe").hide();
                        $(".recommendNew .r_b .li1 p").show();
                        $(".recommendNew .r_b .li2 p").hide();
                        $(".recommendNew .prompt1 .li14 #paidBtn").hide();

                    }else if(msg.recommendStatus=="1"&&msg.recommendFlow=="7"){
                        $(".recommendNew .prompt1 .shenhe").hide();
                        $(".recommendNew .r_b .li1 p").hide();
                        $(".recommendNew .r_b .li2 p").show();
                        $(".recommendNew .prompt1 .li14 #paidBtn").hide();

                    }else if(msg.recommendStatus=="1"&&msg.recommendFlow=="905"){
                        $(".recommendNew .prompt1 .shenhe").hide();
                        $(".recommendNew .r_b .li1 p").hide();
                        $(".recommendNew .r_b .li2 p").show();
                        $(".recommendNew .prompt1 .li14 #paidBtn").hide();
                        $(".recommendNew .r_b .li2 p .pass").html("再次审核");

                    }else if(msg.recommendStatus=="3"&&msg.recommendFlow=="9"){
                        $(".recommendNew .prompt1 .shenhe").hide();
                        $(".recommendNew .r_b .li1 p").hide();
                        $(".recommendNew .r_b .li2 p").hide();
                        $(".recommendNew .prompt1 .li14 #paidBtn").show();

                    }else{
                        $(".recommendNew .prompt1 .shenhe").hide();
                        $(".recommendNew .r_b .li1 p").hide();
                        $(".recommendNew .r_b .li2 p").hide();
                        $(".recommendNew .prompt1 .li14 #paidBtn").hide();
                    }
                }
            }
        })
    }

    // 判断项目类型
    function recommendProjectType(type){
        if(type=="1"){
            return "新房"
        }else{
            return "新房"
        }
    }



    // 关闭确认操作框----------------
    $(".recommendNew .yesDoType .guanbi").click(function () {
        $(".yesDoType").hide();
        $('.zhezhao').css("z-index","800");
        $(".yesDoType .p3 input").attr("data-boolean","false");
        $(".yesDoType .p3 input").removeClass("redBorder");
    });

    // 确认推荐单有效
    $(".prompt1 .shenhe .pass").click(function () {
        $(".yesDoType").show();
        $(".yesDoType .p1").show();
        $(".yesDoType .p2").hide();
        $(".yesDoType .p3").hide();
        $(".yesDoType .div1").show();
        $(".yesDoType .div1 .pass").show();
        $(".yesDoType .div1 .noPass").hide();
        $(".yesDoType .div2").hide();
        $('.zhezhao').css("z-index","900");

    });
    $(".recommendNew .yesDoType .div1 .pass").click(function () {
        changeType({
            recordId:$('.recommendNew .prompt1').attr("data-id"),
            recommendStatus:"1",
            recommendFlow:"2",
            approveMessage:""
        });
    });


    yanzheng(".yesDoType .p3 input",/\S/);
    // 驳回推荐单
    $(".prompt1 .shenhe .noPass").click(function () {
        $(".yesDoType").show();
        $(".yesDoType .p1").hide();
        $(".yesDoType .p2").hide();
        $(".yesDoType .p3").show();
        $(".yesDoType .p3 input").val("");
        $(".yesDoType .div1").show();
        $(".yesDoType .div1 .pass").hide();
        $(".yesDoType .div1 .noPass").show();
        $(".yesDoType .div2").hide();
        $('.zhezhao').css("z-index","900");
    });
    $(".recommendNew .yesDoType .div1 .noPass").click(function () {

        if($(".yesDoType .p3 input").attr("data-boolean")=="true"){
            changeType({
                recordId:$('.recommendNew .prompt1').attr("data-id"),
                recommendStatus:"2",
                recommendFlow:"1",
                approveMessage: $(".yesDoType .p3 input").val()
            });
        }else{
            $(".yesDoType .p3 input").addClass("redBorder");
        }
    });



    // 确认看房确认单有效
    $(".prompt1 .r_b .li1 .pass").click(function () {
        $(".yesDoType").show();
        $(".yesDoType .p1").hide();
        $(".yesDoType .p2").show();
        $(".yesDoType .p3").hide();
        $(".yesDoType .div1").hide();
        $(".yesDoType .div2").show();
        $(".yesDoType .div2 .pass").show();
        $(".yesDoType .div2 .noPass").hide();
        $('.zhezhao').css("z-index","900");
    });
    $(".recommendNew .yesDoType .div2 .pass").click(function () {
        changeType({
            recordId:$('.recommendNew .prompt1').attr("data-id"),
            recommendStatus:"1",
            recommendFlow:"6",
            approveMessage:""
        });
    });


    // 驳回看房确认单
    $(".prompt1 .r_b .li1 .noPass").click(function () {
        $(".yesDoType").show();
        $(".yesDoType .p1").hide();
        $(".yesDoType .p2").hide();
        $(".yesDoType .p3").show();
        $(".yesDoType .p3 input").val("");
        $(".yesDoType .div1").hide();
        $(".yesDoType .div2").show();
        $(".yesDoType .div2 .pass").hide();
        $(".yesDoType .div2 .noPass").show();
        $('.zhezhao').css("z-index","900");
    });
    $(".recommendNew .yesDoType .div2 .noPass").click(function () {
        if($(".yesDoType .p3 input").attr("data-boolean")=="true"){
            changeType({
                recordId:$('.recommendNew .prompt1').attr("data-id"),
                recommendStatus:"1",
                recommendFlow:"4",
                approveMessage: $(".yesDoType .p3 input").val()
            });
        }else{
            $(".yesDoType .p3 input").addClass("redBorder");
        }
    });


    // 修改推荐单状态
    function changeType(data) {
        $.ajax({
            type: 'post',
            url: urlHead + "/recommendRecord/updateRecommendFlow",
            data: data,
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {

                if(data.result=="1"){
                    $(".yesDoType").hide();
                    $(".yesDoType .p3 input").attr("data-boolean","false");
                    $(".yesDoType .p3 input").removeClass("redBorder");
                    $(".recommendNew .yesDoSignIn").hide();

                    $('.zhezhao').css("z-index","800");
                    recommendNewDetails({recordId:$('.recommendNew .prompt1').attr("data-id")});
                    recommendNewDateType({recordId:$('.recommendNew .prompt1').attr("data-id")});
                }else{
                    publicJs.openPromptBox("操作失败！");
                }

            }
        })
    }


    //正则验证函数
    function yanzheng(name,zhengze) {
        // 失去焦点
        $(name).blur(function () {
            var re=zhengze;
            var str=$(this).val();
            if(re.test(str)){
                $(this).removeClass("redBorder");
                $(this).attr("data-boolean","true");
            } else{
                $(this).addClass("redBorder");
                $(this).attr("data-boolean","false");
            }
        });
        // 获取焦点
        $(name).focus(function () {
            $(this).removeClass("redBorder");
        });
    }


    yanzheng(".recommendNew .detailsXinXi .li14 input",/^\d+$/);
    // 实付推荐人佣金------------------
    $(".recommendNew #paidBtn").click(function () {
        if($(".recommendNew .detailsXinXi .li14 input").attr("data-boolean")=="true"){
            $(".recommendNew .yesDoMoney .p1 span").html( $(".recommendNew .detailsXinXi .li14 input").val()+"元");
            $(".recommendNew .yesDoMoney").show();
            $('.zhezhao').css("z-index","900");
        }else{
            $(".recommendNew .detailsXinXi .li14 input").addClass("redBorder");
        }
    });

    // 关闭
    $(".recommendNew .yesDoMoney .guanbi , .recommendNew .yesDoMoney .no").click(function () {
        $(".recommendNew .yesDoMoney").hide();
        $('.zhezhao').css("z-index","800");
    });
    // 确认
    $(".recommendNew .yesDoMoney .yes").click(function () {
        $.ajax({
            type: 'post',
            url: urlHead + "/recommendRecord/updateByRecommendSendmoney",
            data: {
                recordId:$('.recommendNew .prompt1').attr("data-id"),
                recommendSendmoney:$(".recommendNew .detailsXinXi .li14 input").val(),
                approveMessage:"",
                recommendGettype:""
            },
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {

                if(data.result=="1"){
                    $(".recommendNew .yesDoMoney").hide();
                    $('.zhezhao').css("z-index","800");
                    recommendNewDetails({recordId:$('.recommendNew .prompt1').attr("data-id")});
                    recommendNewDateType({recordId:$('.recommendNew .prompt1').attr("data-id")});
                }else{
                    publicJs.openPromptBox("操作失败！");
                }
            }
        })
    });


    // 关闭弹框
    $(".recommendNew .yesDoSignIn .guanbi , .recommendNew .yesDoSignIn .no").click(function () {
        $(".recommendNew .yesDoSignIn").hide();
        $('.zhezhao').css("z-index","800");
        $(".recommendNew .yesDoSignIn div input").removeClass("redBorder");
        $(".recommendNew .yesDoSignIn div input").val("");
    });

    //通过签约单审核------------------
    $(".recommendNew .r_b .li2 .pass").click(function () {
        $(".recommendNew .yesDoSignIn").show();
        $(".recommendNew .yesDoSignIn div").show();
        $(".recommendNew .yesDoSignIn p").hide();
        $('.zhezhao').css("z-index","900");
        $(".recommendNew .yesDoSignIn .yes").attr("type","pass");
    });
    // 驳回
    $(".recommendNew .r_b .li2 .noPass").click(function () {
        $(".recommendNew .yesDoSignIn").show();
        $(".recommendNew .yesDoSignIn p").show();
        $(".recommendNew .yesDoSignIn div").hide();
        $('.zhezhao').css("z-index","900");
        $(".recommendNew .yesDoSignIn .yes").attr("type","noPass");
    });

    yanzheng(".recommendNew .yesDoSignIn .div1 input",/^\d+$/);
    yanzheng(".recommendNew .yesDoSignIn .div2 input",/^\d+$/);
    $(".recommendNew .yesDoSignIn .yes").click(function () {
        if($(".recommendNew .yesDoSignIn .yes").attr("type")=="pass"){
            if($(".recommendNew .yesDoSignIn .div1 input").attr("data-boolean")=="true"&&$(".recommendNew .yesDoSignIn .div2 input").attr("data-boolean")=="true"){
                $.ajax({
                    type: 'post',
                    url: urlHead + "/recommendRecord/updateByMakeMoney",
                    data: {
                        recordId:$('.recommendNew .prompt1').attr("data-id"),
                        makeMoney:$(".recommendNew .yesDoSignIn .div1 input").val(),
                        approveMessage:"",
                        contractMoney:$(".recommendNew .yesDoSignIn .div2 input").val()
                    },
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    success: function (data) {

                        if(data.result=="1"){
                            $(".recommendNew .yesDoSignIn").hide();
                            $(".recommendNew .yesDoSignIn div input").val("");
                            $(".recommendNew .yesDoSignIn div input").attr("data-boolean","false");
                            $('.zhezhao').css("z-index","800");
                            recommendNewDetails({recordId:$('.recommendNew .prompt1').attr("data-id")});
                            recommendNewDateType({recordId:$('.recommendNew .prompt1').attr("data-id")});
                        }else{
                            publicJs.openPromptBox("操作失败！");
                        }
                    }
                })
            }else if($(".recommendNew .yesDoSignIn .div1 input").attr("data-boolean")!="true"){
                $(".recommendNew .yesDoSignIn .div1 input").addClass("redBorder");
            }else if($(".recommendNew .yesDoSignIn .div2 input").attr("data-boolean")!="true"){
                $(".recommendNew .yesDoSignIn .div2 input").addClass("redBorder");
            }

        }else{
            changeType({
                recordId:$('.recommendNew .prompt1').attr("data-id"),
                recommendStatus:"1",
                recommendFlow:"6",
                approveMessage:""
            });
        }
    });



});

