$(function(){
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


    // 刷新页面
    $(".property .shuaxin").click(function(){
        $(".main .box").load("property.html");
    });


    var propertyName="";
    var page =1;

    propertyList({propertyName: "",propertyStatus: "",startTime: "",endTime: "",page: "1",rows: "5"});

    // 模糊搜索
    $(document).on("click",".property .title .search",function(){
        page=1;
        $('.paging .nowPage').html(page);
        $(".paging .jumpPage input").val("");
        propertyName=$(".property .title input").val();

        // $(".property .title .search").attr("data-val",$(".property .title input").val());
        propertyList({propertyName: propertyName,propertyStatus: "",startTime: "",endTime: "",page: "1",rows: "5"});
    });

    //请求物业公司列表---------------------
    function propertyList(data){
        $.ajax({
            type: 'post',
            url: urlHead + "/Property/findAllByPage",
            data: data,
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {
                $(".propertyCompany tbody").html("");

                msg = data.object.data;
                if (data.result == "1") {
                    $(".property .paging").attr("data-totalPage",Math.ceil(data.object.totalNumber/data.object.pageSize));

                    for (var i = 0; i < msg.length; i++) {
                        $(".propertyCompany tbody").append("<tr data-id='" + msg[i].property.propertyId + "'>" +
                            "<td>" + msg[i].property.propertyName + "</td>" +
                            "<td>" + msg[i].property.propertyNumbers + "</td>" +
                            "<td>" + msg[i].property.propertyTell + "</td>" +
                            "<td>" + msg[i].communityNumbers + "</td>" +
                            "<td>" + msg[i].property.propertyMan + "</td>" +
                            "<td>" + msg[i].property.propertyManPhone + "</td>" +
                            "<td class='details'><span>详情</span></td>" +
                            "<td class='do'>" +
                            "<button  class='change'>修改</button>" +
                            "<button class='stop' data-status ='"+msg[i].property.propertyStatus+"'>"+propertyType(msg[i].property.propertyStatus)+"</button>" +
                            "</td>" +
                        "</tr>")
                    }
                }
            }
        });

    }

    function propertyType(type) {
        if(type=="0"){
            return "启用"
        }else if(type=="1"){
            return "停用"
        }else{
            return "未知"
        }
    }



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
            propertyList({propertyName: propertyName,propertyStatus: "",startTime: "",endTime: "",page: page,rows: "5"});
        });

        // 下一页
        $(".paging .downPage").click(function(){
            totalPage = parseInt($(".property .paging").attr("data-totalPage"));

            if(totalPage!=0){
                if(page>=totalPage){
                    page=totalPage;
                }else{
                    page+=1;
                }
                $(".paging .nowPage").html(page);
                propertyList({propertyName: propertyName,propertyStatus: "",startTime: "",endTime: "",page: page,rows: "5"});
            }
        });

        // 跳页
        $(".paging .yes").click(function(){
            totalPage = parseInt($(".property .paging").attr("data-totalPage"));

            if($(".paging .jumpPage input").val()-0>=1&&$(".paging .jumpPage input").val()-0<=totalPage){
                page=$(".paging .jumpPage input").val()-0;
                $(".paging .nowPage").html(page);

                propertyList({propertyName: propertyName,propertyStatus: "",startTime: "",endTime: "",page: page,rows: "5"});
            }
        });
    }



    // 物业公司详情
    $(document).on("click",".property .propertyCompany .details span",function(e){
        e.stopPropagation();
        $(".property .detailsBox").fadeIn(300);
        $(".zhezhao").show();

        $.ajax({
            type: 'post',
            url: urlHead + "/Property/getById",
            data: {
                propertyId:$(this).parent().parent("tr").attr("data-id")
            },
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {
                if (data.result == "1") {
                    $(".property .detailsBox textarea").val(data.object.propertyDetail);
                }
            }
        });
    });

    $(".property .detailsBox img").click(function () {
        $(".property .detailsBox").fadeOut(100);
        $(".main .zhezhao").hide();
    });



    // 添加物业公司
    $(".property .title .add").click(function () {
        $(".property .addBox").fadeIn(300);
        $(".main .zhezhao").show();
    });

    $(".property .addBox img").click(function () {
        $(".property .addBox").fadeOut(100);
        $(".main .zhezhao").hide();
        $(".property .addBox li input,.property .addBox li textarea").removeClass("redBorder");
    });

    // 修改物业公司
    $(document).on("click",".property .propertyCompany .do .change",function(e){
        e.stopPropagation();
        $(".property .changeBox").fadeIn(300);
        $(".main .zhezhao").show();
        propertyChange($(this).parent().parent("tr").attr("data-id"));
    });

    $(".property .changeBox img").click(function () {
        $(".property .changeBox").fadeOut(100);
        $(".main .zhezhao").hide();
        $(".property .changeBox li input,.property .changeBox li textarea").removeClass("redBorder");
    });

    // 加载修改信息
    function propertyChange(id) {
        $.ajax({
            type: 'post',
            url: urlHead + "/Property/getById",
            data: {
                propertyId:id
            },
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function (data) {
                if (data.result == "1") {
                    $(".property .changeBox button").attr("data-id",data.object.propertyId);
                    $(".property .changeBox .companyName input").val(data.object.propertyName);
                    $(".property .changeBox .peopleNum input").val(data.object.propertyNumbers);
                    $(".property .changeBox .companyTel input").val(data.object.propertyTell);
                    $(".property .changeBox .companyDetails textarea").val(data.object.propertyDetail);
                    $(".property .changeBox .duijiePeople input").val(data.object.propertyMan);
                    $(".property .changeBox .phone input").val(data.object.propertyManPhone);
                }
            }
        })
    }



    //点击添加物业---------------------
    yanzheng(".property .addBox .companyName input",/^[a-zA-Z0-9\u4e00-\u9fa5]+$/);
    yanzheng(".property .addBox .peopleNum input",/^\d+$/);
    yanzheng(".property .addBox .companyTel input",/(\d{4}-|\d{3}-)?(\d{8}|\d{7})/);
    yanzheng(".property .addBox .companyDetails textarea",/\S/);
    yanzheng(".property .addBox .duijiePeople input",/^[\u4E00-\u9FA5]{2,6}$/);
    yanzheng(".property .addBox .phone input",/^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])\d{8}$/);

    $(".property .addBox button").click(function () {
        if( $(".property .addBox .companyName input").attr("data-boolean")=="true"&&
            $(".property .addBox .peopleNum input").attr("data-boolean")=="true"&&
            $(".property .addBox .companyTel input").attr("data-boolean")=="true"&&
            $(".property .addBox .companyDetails textarea").attr("data-boolean")=="true"&&
            $(".property .addBox .duijiePeople input").attr("data-boolean")=="true"&&
            $(".property .addBox .phone input").attr("data-boolean")=="true"){

            $.ajax({
                type: 'post',
                url: urlHead + "/Property/addProperty",
                data: {
                    propertyName:$(".property .addBox .companyName input").val(),
                    propertyNumbers:$(".property .addBox .peopleNum input").val(),
                    propertyTell:$(".property .addBox .companyTel input").val(),
                    propertyDetail:$(".property .addBox .companyDetails textarea").val(),
                    propertyMan:$(".property .addBox .duijiePeople input").val(),
                    propertyManPhone:$(".property .addBox .phone input").val()
                },
                dataType:'json',
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if(data.result=="1"){
                        propertyList({propertyName: "",propertyStatus: "",startTime: "",endTime: "",page: "1",rows: "5"});
                        openPromptBox("添加成功！");
                        setTimeout(function () {
                            $(".promptBox").hide();
                            $(".zhezhao").hide();
                            $(".zhezhao").css("z-index","800");
                        },1200);

                        $(".property .addBox").fadeOut(100);
                        $(".property .addBox li input").val("");
                        $(".property .addBox li textarea").val("");
                        $(".property .addBox li input").attr("data-boolean","false");
                        $(".property .addBox li textarea").attr("data-boolean","false");
                    }
                }
            })
        }

    });


    //点击修改物业---------------------
    yanzheng(".property .changeBox .companyName input",/^[a-zA-Z0-9\u4e00-\u9fa5]+$/);
    yanzheng(".property .changeBox .peopleNum input",/^\d+$/);
    yanzheng(".property .changeBox .companyTel input",/(\d{4}-|\d{3}-)?(\d{8}|\d{7})/);
    yanzheng(".property .changeBox .companyDetails textarea",/\S/);
    yanzheng(".property .changeBox .duijiePeople input",/^[\u4E00-\u9FA5]{2,6}$/);
    yanzheng(".property .changeBox .phone input",/^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])\d{8}$/);

    $(".property .changeBox button").click(function () {
        if( $(".property .changeBox .companyName input").attr("data-boolean")=="true"&&
            $(".property .changeBox .peopleNum input").attr("data-boolean")=="true"&&
            $(".property .changeBox .companyTel input").attr("data-boolean")=="true"&&
            $(".property .changeBox .companyDetails textarea").attr("data-boolean")=="true"&&
            $(".property .changeBox .duijiePeople input").attr("data-boolean")=="true"&&
            $(".property .changeBox .phone input").attr("data-boolean")=="true"){
            $.ajax({
                type: 'post',
                url: urlHead + "/Property/updateProperty",
                data: {
                    propertyId:$(this).attr("data-id"),
                    propertyName:$(".property .changeBox .companyName input").val(),
                    propertyNumbers:$(".property .changeBox .peopleNum input").val(),
                    propertyTell:$(".property .changeBox .companyTel input").val(),
                    propertyDetail:$(".property .changeBox .companyDetails textarea").val(),
                    propertyMan:$(".property .changeBox .duijiePeople input").val(),
                    propertyManPhone:$(".property .changeBox .phone input").val()
                },
                dataType:'json',
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if(data.result=="1"){
                        propertyList({propertyName: propertyName,propertyStatus: "",startTime: "",endTime: "",page: page,rows: "5"});
                        openPromptBox("修改成功！");
                        setTimeout(function () {
                            $(".promptBox").hide();
                            $(".zhezhao").hide();
                            $(".zhezhao").css("z-index","800");
                        },1200);

                        $(".property .changeBox").fadeOut(100);
                    }
                }
            })
        }
    });

    //点击停用---------------------
    $(document).on("click",".property .propertyCompany .do .stop",function(e){
        var status;
        e.stopPropagation();
        if($(this).attr("data-status")=="0"){
            status="1"
        }else{
            status="0"
        }
        $.ajax({
            type: 'post',
            url: urlHead + "/Property/updateProperty",
            data: {
                propertyId:$(this).parent().parent("tr").attr("data-id"),
                propertyStatus:status
            },
            dataType:'json',
            xhrFields: {withCredentials: true},
            success: function (data) {
                if(data.result=="1"){
                    propertyList({propertyName: propertyName,propertyStatus: "",startTime: "",endTime: "",page: page,rows: "5"});
                }else{
                    openPromptBox("状态修改失败！");
                    $(".zhezhao").css("z-index","900");
                }
            }
        })
    });




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


});




