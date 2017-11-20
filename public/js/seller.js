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

    var companyName="";
    var page =1;

    // 刷新页面
    $(".seller .shuaxin").click(function(){
        $(".main .box").load("seller.html");
    });

    // 导航栏切换
    $(".seller .sellerNav li").click(function () {
        $(this).css("background-color", "#5a98de");
        $(this).siblings().css("background-color", "#a1a1a1");

        page=1;
        $('.paging .nowPage').html(page);
        $(".paging .jumpPage input").val("");
        companyName="";

        $(".seller .sellerNav").attr("data-companyStatus",$(this).attr("data-companyStatus"));
        seller({companyName: companyName,companyStatus: $(".seller .sellerNav").attr("data-companyStatus"),page: "1", rows: "5"});
    });

    // 详情
    $(document).on("click",".seller table .details",function (e) {
        e.stopPropagation();
        $(".seller .detailsBox").fadeIn(300);
        $(".main .zhezhao").show();
        $.ajax({
           data: {
               sellersCompanyId:$(this).attr("data-id")
           },
            type:'post',
            url:urlHead + "/sellersCompany/getById",
            dataType:'json',
            xhrFields: {withCredentials: true},
            success:function (data) {
                if(data.result=="1"){
                    $(".detailsBox .li1 span").html(data.object.sellersUserLicenseId);
                    $(".detailsBox .li2 img").attr("src",urlImg + '/images/merchantsFigure/' + data.object.sellersUserImg);
                }else {
                    openPromptBox("获取数据失败");
                }
            },
            error: function (data) {
                openPromptBox('网络错误!');
            },
        });
    });

    // 通过
    $(document).on("click", ".seller .do .pass", function () {
        var sellersUserId = $(this).attr("data-sellersUserId");
        var sellersCompanyId = $(this).attr("data-sellersCompanyId");
        $(".seller .passBox").fadeIn(300);
        $(".main .zhezhao").show();
        $(document).on("click", ".seller .passBox .pass", function () {
            $.ajax({
                type: 'post',
                url: urlHead + "/sellersCompany/updateStatus",
                data: {
                    sellersUserId: sellersUserId,
                    sellersCompanyId: sellersCompanyId,
                    status: "1",
                    sellersUserDescribe:"审核通过"
                },
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: function (data) {
                    $(".seller .passBox").hide(300);
                    $(".main .zhezhao").hide();
                    seller({companyName: companyName,companyStatus:$(".seller .sellerNav").attr("data-companyStatus"),page: page, rows: "5"});
                }
            });
        });
    });

    // 不通过
    $(document).on("click",".seller .do .noPass",function () {
        $(".seller .noPassBox").fadeIn(300);
        $(".main .zhezhao").show();

        var sellersUserId = $(this).attr("data-sellersUserId");
        var sellersCompanyId = $(this).attr("data-sellersCompanyId");
        $(document).on("click", ".seller .noPassBox .pass", function () {
            if(!$(".seller .noPassBox #select").val()){
                openPromptBox("请选择驳回原因后再提交");
                return;
            }
            $.ajax({
                type: 'post',
                url: urlHead + "/sellersCompany/updateStatus",
                data: {
                    sellersUserId: sellersUserId,
                    sellersCompanyId: sellersCompanyId,
                    status: "2",
                    sellersUserDescribe:$('#select option:selected').val()
                },
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: function (data) {
                    $(".seller .noPassBox").hide(300);
                    $(".main .zhezhao").hide();
                    seller({companyName: companyName,companyStatus:$(".seller .sellerNav").attr("data-companyStatus"),page: page, rows: "5"});
                }
            });
        });
    });

    //关闭弹出框
    $(document).on("click",".seller .detailsBox .close,.seller .passBox .noPass,.seller .passBox .close,.seller .noPassBox .noPass,.seller .noPassBox .close",function () {
        $(".seller .noPassBox").fadeOut(200);
        $(".seller .passBox").fadeOut(200);
        $(".seller .detailsBox").fadeOut(200);
        $(".main .zhezhao").hide();
    });

    //搜索
    $(".seller .title .search").click(function () {
        page=1;
        $('.paging .nowPage').html(page);
        $(".paging .jumpPage input").val("");
        companyName=$(".seller .title input").val();

        // $(".seller .title .search").attr("data-val",$(".seller .title input").val());
        seller({companyName: companyName,companyStatus: $(".seller .sellerNav").attr("data-companyStatus"),page: "1", rows: "5"});
    });



    //分页
    paging();
    function paging() {
        var totalPage ="1";
            // 上一页
        $(".paging .upPage").click(function(){
            if(page<=1){
                page=1;
            }else{
                page-=1;
            }
            $('.paging .nowPage').html(page);
            seller({companyName: companyName,companyStatus: $(".seller .sellerNav").attr("data-companyStatus"),page: page, rows: "5"});
        });

        // 下一页
        $(".paging .downPage").click(function(){
            totalPage = parseInt($(".seller .paging").attr("data-totalPage"));
            if(totalPage!=0) {
                if (page >= totalPage) {
                    page = totalPage;
                } else {
                    page += 1;
                }
                $(".paging .nowPage").html(page);
                seller({companyName: companyName,companyStatus: $(".seller .sellerNav").attr("data-companyStatus"),page: page, rows: "5"});
            }
        });

        // 跳页
        $(".paging .yes").click(function(){
            totalPage = parseInt($(".seller .paging").attr("data-totalPage"));
            if($(".paging .jumpPage input").val()-0>=1&&$(".paging .jumpPage input").val()-0<=totalPage){
                page=$(".paging .jumpPage input").val()-0;
                $(".paging .nowPage").html(page);
                seller({companyName: companyName,companyStatus: $(".seller .sellerNav").attr("data-companyStatus"),page: page, rows: "5"});
            }
        });
    }



    //默认进页面加载数据列表
    seller({companyName: "", companyStatus: 0, page: "1", rows: "5"});

    //封装
    function seller(dataPara) {
        $.ajax({
            type: 'post',
            url: urlHead + "/sellersCompany/getAllByConditions",
            data: dataPara,
            dataType: 'json',
            xhrFields: {withCredentials: true},

            success: function (data) {
                $(".seller table tbody").html("");

                if (data.result == "1") {

                    $(".seller .paging").attr("data-totalPage",Math.ceil(data.object.totalNumber/data.object.pageSize));

                    msg = data.object.data;

                    for (var i = 0; i < msg.length; i++) {
                        $(".seller table tbody").append("<tr>"+
                            "<td>"+(i+1)+"</td>"+
                            "<td>"+msg[i].companyName+"</td>"+
                            "<td>"+msg[i].companyAddress+"</td>"+
                            "<td>"+msg[i].sellersUserLegalperson+"</td>"+
                            "<td class='details' data-id='"+msg[i].sellersCompanyId+"'>详情</td>"+
                            "<td>"+msg[i].sellersUsers[0].sellersUserPhone+"</td>"+
                            "<td>"+companyStatus(msg[i].companyStatus)+"</td>"+
                            "<td>"+companyType(msg[i].companyType)+"</td>"+
                            "<td class='do'>"+dohtml(msg[i].companyStatus,msg[i].sellersUsers[0].sellersUserId,msg[i].sellersCompanyId)+"</td>"+
                        "</tr>");
                    }

                    function companyStatus(type) {
                        if(type=="0"){
                            return "待审核";
                        }else if(type=="1"){
                            return "启用";
                        }else if(type=="2"){
                            return "审核未通过";
                        }else{
                            return "未知";
                        }
                    }

                    function companyType(type) {
                        if(type=="1"){
                            return "内部公司";
                        }else if(type=="2"){
                            return "外部公司";
                        }else{
                            return "未知";
                        }
                    }

                    function dohtml(type,id1,id2) {
                        if(type=="0"){
                            return "<button class='pass' data-sellersUserId="+id1+" data-sellersCompanyId="+id2+">通过</button><button class='noPass' data-sellersUserId="+id1+" data-sellersCompanyId="+id2+">驳回</button>";
                        }else if(type=="1"){
                            return "审核已通过";
                        }else if(type=="2"){
                            return "审核未通过";
                        }else{
                            return "未知";
                        }
                    }
                }else {
                    openPromptBox("获取数据失败");
                }
            }
        });
    }

});