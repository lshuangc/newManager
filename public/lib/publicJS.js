// 接口存储服务器

//正式服务器
// var urlHead="http://106.15.193.109:8080";

//测试服务器
// var urlHead="http://192.168.1.101:8080";

//老张服务器
var urlHead="http://192.168.5.104:8080";

//阳哥服务器
// var urlHead="http://192.168.5.112:8080";

//丙阳服务器
// var urlHead="http://192.168.5.107:8080";

//何志鹏服务器
// var urlHead="http://192.168.5.130:8080";

// 图片存储服务器

//测试服务器
 var urlImg="http://192.168.1.101:8083";

//正式服务器
// var urlImg="http://106.15.193.109:8083";

$(function(){

});


var publicJs = {
    //正则验证函数
    yanzheng: function (name, zhengze) {
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
    },

    //弹出提示框
    openPromptBox: function (str) {
        $(".promptBox").show();
        $(".promptBox p").html(str);
        $(".zhezhao").show();
    },

    //关闭提示框
    closePromptBox: function(){
        $(".promptBox img").click(function(){
            $(".promptBox").hide();
            $(".zhezhao").css("z-index","800");
            $(".zhezhao").hide();
        });
    },
    //关闭提示框
    closePromptBox1: function(){
        $(".promptBox img").click(function(){
            $(".promptBox").hide();
            $(".zhezhao").css("z-index","800");
        });
    },
    // 格式化时间戳
    dateFormat: function(date){
        var time = new Date(date);
        var y = time.getFullYear();//年
        var m = time.getMonth() + 1;//月
        var d = time.getDate();//日
        // var h = time.getHours();//时
        // var mm = time.getMinutes();//分
        // var s = time.getSeconds();//秒

        m = m < 9 ? '0' + m : m;
        d = d < 9 ? '0' + d : d;
        // mm = mm < 9 ? '0' + mm : mm;
        // h = h < 9 ? '0' + h : h;
        return y+"-"+m+"-"+d;
    }
};