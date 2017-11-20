$(function () {

    // 刷新页面
    $(".insideProject .shuaxin").click(function () {
        $(".main .box").load("insideProject.html");
    });

    var page = 1;

    //分页功能开始
    paging();
    function paging() {
        var totalPage = 1;
        // 上一页
        $(".paging .upPage").click(function () {
            if (page <= 1) {
                page = 1;
            } else {
                page -= 1;
            }
            $('.paging .nowPage').html(page);
            insideProject({ page: page, rows: "10" });
        });

        // 下一页
        $(".paging .downPage").click(function () {
            totalPage = parseInt($(".insideProject .paging").attr("data-totalPage"));

            if (totalPage != 0) {
                if (page >= totalPage) {
                    page = totalPage;
                } else {
                    page += 1;
                }
                $(".paging .nowPage").html(page);
                insideProject({ page: page, rows: "10" });
            }
        });

        // 跳页
        $(".paging .yes").click(function () {
            totalPage = parseInt($(".insideProject .paging").attr("data-totalPage"));

            if ($(".paging .jumpPage input").val() - 0 >= 1 && $(".paging .jumpPage input").val() - 0 <= totalPage) {
                page = $(".paging .jumpPage input").val() - 0;
                $(".paging .nowPage").html(page);

                insideProject({ page: page, rows: "10" });
            }
        });
    }
    //分页功能end





    /*----------------------------弹框-----------------------------*/

    // 命名空间
    var prompt = {
        // 设置省市区Code值
        setCityCode: function (sheng, shi, qu, num) {
            $(sheng).val($('#sheng' + num).find('option:selected').attr('data-code'));
            $(shi).val($('#shi' + num).find('option:selected').attr('data-code'));
            $(qu).val($('#qu' + num).find('option:selected').attr('data-code'));
        },
        // 添加物业公司
        addProperty: function () {
            $.ajax({
                type: 'post',
                url: urlHead + '/Property/findAllProperty',
                data: {},
                dataType: 'json',
                success: function (info) {
                    if (info.result == '1') {
                        var str = '';
                        var data = info.object;
                        for (var i = 0; i < data.length; i++) {
                            str += `<option value="${data[i].propertyId}">${data[i].propertyName}</option>`;
                        }
                        $('.addProject .propertyName, .updateProject .propertyName').html(str);
                    } else {
                        console.log('物业公司获取失败');
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox();
                }
            });
        },
        // 添加销售商
        addSellers: function () {
            $.ajax({
                type: 'post',
                url: urlHead + '/sellersCompany/getAllByConditions',
                data: {
                    page: 1,
                    rows: 999
                },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    if (info.result == '1') {
                        var str = '';
                        var data = info.object.data;
                        for (var i = 0; i < data.length; i++) {
                            str += `<option value="${data[i].sellersCompanyId}">${data[i].companyName}</option>`;
                        }
                        $('.addProject .sellersName, .updateProject .sellersName').html(str);
                    } else {
                        console.log('物业公司获取失败');
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox();
                }
            });
        },

        // 添加项目
        addProject: function (formdata) {
            $.ajax({
                type: 'post',
                url: urlHead + '/Community/addCommunity',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    if (info.result == '1') {
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('添加成功');
                        $('.addProject').hide();
                        publicJs.closePromptBox();

                        $('#addProjectForm')[0].reset();
                        $('#imgBox').html('');
                        $("#distpicker1").distpicker('reset', true);

                        insideProject();
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 查询项目当前id对应信息
        selectProject: function (id) {
            $.ajax({
                type: 'post',
                url: urlHead + '/Community/getCommunitiesById',
                data: { id: id },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    var data = info.object[0];
                    if (info.result == '1') {

                        //项目详情赋值
                        $('.prompt .detail .sellingpoint').text(data.sellingPoint);
                        $('.prompt .detail .periphery').text(data.periPhery);
                        $('.prompt .detail .details').text(data.details);
                        $('.prompt .detail .devloper').text(data.devloper);
                        $('.prompt .detail .builDers').text(data.builders);
                        // $('.prompt .detail .companyName').val(data.devloper);
                        $('.prompt .detail .propertyName').text(data.propertyName);
                        // $('.prompt .detail .latestSaleTime').val(data.devloper);
                        // $('.prompt .detail .firstHandTime').val(data.devloper);
                        // $('.prompt .detail .buildingType').val(data.devloper);
                        $('.prompt .detail .address').text(data.address);


                        // 项目基本信息
                        $('#updateProjectForm .projectName').val(data.name);
                        $('#updateProjectForm .devloper').val(data.devloper);

                        $('#sheng2').val(data.provinceName);
                        $('#sheng2').trigger('change');
                        /*for(var i = 0; $('#shi2').length; i++){
                            if($('#shi2').eq(i) == data.cityName){
                                $('#shi2').val(data.cityName);
                                $('#shi2').trigger('change');

                                return
                            }
                        }*/
                        $('#qu2').val(data.countyName);
                        $('#qu2').trigger('change');


                        $('#updateProjectForm .address').val(data.address);
                        $('#updateProjectForm .sellingPoint').val(data.sellingPoint);
                        $('#updateProjectForm .periPhery').val(data.periPhery);
                        $('#updateProjectForm .details').val(data.details);
                        $('#updateProjectForm .builders').val(data.builders);
                        $('#updateProjectForm .propertyName').val(data.propertyId);
                        $('#updateProjectForm .sellersName').val(data.sellersCompanyId)

                        //     $(this).attr("data-num", "2");
                        //     $(this).siblings().attr("data-num", "1");
                        // } else {
                        //     $('insideProjectHouse').hide();
                        //     $(this).attr("data-num", "1");
                        //     $(this).siblings().attr("data-num", "1");
                    }
                }
            })
        },
        // 修改项目
        updateProject: function (formdata) {
            $.ajax({
                type: 'post',
                url: urlHead + '/Community/updateCommuity',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('修改成功');
                        $('.updateProject').hide();
                        publicJs.closePromptBox();

                        insideProject();
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },

        // 添加轮播图
        addImg: function (formdata) {
            $.ajax({
                type: 'post',
                url: urlHead + '/ConfigControler/addCarouselFigure',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        prompt.selectImg($('.prompt #updateImgForm .hide').val(), prompt.addImgList);
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('图片添加成功！');
                        publicJs.closePromptBox1();
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 查询轮播图
        selectImg: function (id, renderImg) {
            $.ajax({
                type: 'post',
                url: urlHead + '/ConfigControler/selectConfig',
                data: {
                    type: '7',
                    configId: id
                },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    var data = info.object;
                    var html = '';
                    if (info.result == '1') {

                        renderImg(data);
                    }

                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        addImgList: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += `<li>
                            <img src='${ urlImg}/images/carouselFigure/${data[i].img}' alt="轮播图">
                            <div class="updateImgBtn">
                                删除
                                <input type="button" data-id='${ data[i].id}' class="carouselFigureImg"/>
                            </div>
                        </li>`;
            }
            $('.prompt .updateProject .xg ul').html(html + `<li class="lastLi">
                        <div class="fileImg">
                            <input type="file" size="6" id="addProjectImg2" name="carouselFigureImg" class="carouselFigureImg" multiple accept="image/*"  />
                        </div>
                    </li>`);
        },
        // 删除单张轮播图
        deleteImg: function (id) {
            $.ajax({
                type: 'post',
                url: urlHead + '/ConfigControler/deleteConfig',
                data: { id: id },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    if (info.result == '1') {
                        prompt.selectImg($('.prompt #updateImgForm .hide').val(), prompt.addImgList);
                        // prompt.selectImg($('.prompt #updateImgForm .hide').val());
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('图片删除成功！');
                        publicJs.closePromptBox1();
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },

        //添加楼盘信息
        addCommunityDetail: function (formdata, communityId) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityDetail/addCommunityDetail',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('添加成功');
                        $('.addHouses').hide();
                        publicJs.closePromptBox();

                        $('#addCommunityDetailForm')[0].reset();

                        renderCommunity(communityId);
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 查询当前id对应楼盘信息
        selectCommunity: function (id) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityDetail/findById',
                data: { id: id },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    var data = info.object;
                    if (info.result == '1') {
                        console.log(data.houseSp);

                        $('.prompt #updateCommunityDetailForm .id').val(data.id);
                        $('.prompt #updateCommunityDetailForm .communityId').val(data.communityId);
                        $('.prompt #updateCommunityDetailForm .detailStatus').val(data.detailStatus);
                        $('.prompt #updateCommunityDetailForm .detailName').val(data.detailName);
                        $('.prompt #updateCommunityDetailForm .builDingType').val(data.builDingType);
                        $('.prompt #updateCommunityDetailForm .houseProportionRange3').val(splitLink(data.houseProportionRange)[0]);
                        $('.prompt #updateCommunityDetailForm .houseProportionRange4').val(splitLink(data.houseProportionRange)[1]);
                        $('.prompt #updateCommunityDetailForm .houseTypeRange3').val(splitLink(data.houseTypeRange)[0]);
                        $('.prompt #updateCommunityDetailForm .houseTypeRange4').val(splitLink(data.houseTypeRange)[1]);
                        $('.prompt #updateCommunityDetailForm .houseSp3').val(splitLink(data.houseSp)[0]);
                        $('.prompt #updateCommunityDetailForm .houseSp4').val(splitLink(data.houseSp)[1]);
                        $('.prompt #updateCommunityDetailForm .averagePrice3').val(splitLink(data.averagePrice)[0]);
                        $('.prompt #updateCommunityDetailForm .averagePrice4').val(splitLink(data.averagePrice)[1]);
                        $('.prompt #updateCommunityDetailForm #ECalendar_date3').val(publicJs.dateFormat(data.latestSaleTime.time));
                        $('.prompt #updateCommunityDetailForm #ECalendar_date4').val(publicJs.dateFormat(data.firstHandTime.time));
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 修改楼盘
        updateCommunity: function (formdata, communityId) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityDetail/updateCommunityDetail',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('修改成功');
                        $('.prompt .updateHouses').hide();
                        publicJs.closePromptBox();

                        renderCommunity(communityId);
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 修改楼盘状态
        updateCommunityStatus: function (id, detailStatus) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityDetail/updateCommunityDetail',
                data: {
                    id: id,
                    detailStatus: detailStatus
                },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        if (detailStatus == '0') {
                            $('.insideProjectUpOrDown').text('下线');
                            publicJs.openPromptBox('楼盘上线!');
                            publicJs.closePromptBox();
                        } else if (detailStatus == '1') {
                            publicJs.openPromptBox('楼盘下线!');
                            publicJs.closePromptBox();
                            $('.insideProjectUpOrDown').text('上线');
                        }
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常!');
                    publicJs.closePromptBox1();
                }
            })

        },

        // 添加户型
        addHouseType: function (formdata, communityDetailId) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityHousetype/addCommunityHousetype',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    if (info.result == '1') {
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('添加成功');
                        $('.prompt .addHouseType').hide();
                        publicJs.closePromptBox();

                        renderHouseType(communityDetailId);

                        $('#addHouseType')[0].reset();
                        $('.prompt #addHouseType .fileImg').css({ "background": "url(../img/up.png) no-repeat", "background-size": "100% 100%" });
                        $('.prompt #addHouseType .typeCommision1').attr('name', '');
                        $('.prompt #addHouseType .typeCommision2').attr('name', '');
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 查询当前id对应户型信息
        selectHouseType: function (id) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityHousetype/findById',
                data: { communityHousetypeId: id },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    var data = info.object[0];
                    console.log(info);
                    if (info.result == '1') {
                        $('.prompt #updateHouseType .houseTypeId').val(data.id);
                        $('.prompt #updateHouseType .communityId').val(data.communityId);
                        $('.prompt #updateHouseType .communityDetailId').val(data.communityDetailId);
                        $('.prompt #updateHouseType .typeDatail').val(data.typeDatail);
                        $('.prompt #updateHouseType .typeArea').val(data.typeArea);
                        $('.prompt #updateHouseType .builDingType').val(data.builDingType);
                        $('.prompt #updateHouseType .communityTotalPrice').val(data.communityTotalPrice);
                        $('.prompt #updateHouseType .communityUnitPrice').val(data.communityUnitPrice);
                        if (data.type == '0') {
                            $('.prompt #updateHouseType .type1').prop('checked', 'true');
                            $('.prompt #updateHouseType .typeCommision1').attr('name', 'typeCommision');
                            $('.prompt #updateHouseType .typeCommision2').removeAttr('name');
                            $('.prompt #updateHouseType .typeCommision2').attr('disabled', 'true');
                            $('.prompt #updateHouseType .typeCommision1').val(data.typeCommision);
                        } else if (data.type == '1') {
                            $('.prompt #updateHouseType .type2').prop('checked', 'true');
                            $('.prompt #updateHouseType .typeCommision2').attr('name', 'typeCommision');
                            $('.prompt #updateHouseType .typeCommision1').removeAttr('name');
                            $('.prompt #updateHouseType .typeCommision1').attr('disabled', 'true');
                            $('.prompt #updateHouseType .typeCommision2').val(data.typeCommision);
                        }
                        $('.prompt #updateHouseType .typeCommision').val(data.typeCommision);

                        var src = `${urlImg}/images/communitytype/${data.typeImgurl}`;
                        if (data.typeImgurl == '') {
                            $('.prompt #updateHouseType .fileImg').css({ 'background': 'url(../img/up.png)', 'background-size': '100% 100%' });
                        } else {
                            $('.prompt #updateHouseType .fileImg').css({ 'background': 'url(' + src + ')', 'background-size': '100% 100%' });
                        }
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 修改户型
        updateHouseType: function (formdata, communityDetailId) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityHousetype/updateCommunityHousetype',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        $('.zhezhao').css('z-index', '900');
                        publicJs.openPromptBox('修改成功');
                        $('.prompt .updateHouseType').hide();
                        publicJs.closePromptBox();


                        renderHouseType(communityDetailId);
                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },
        // 删除户型
        deleteHouseType: function (id, communityDetailId) {
            $.ajax({
                type: 'post',
                url: urlHead + '/CommunityHousetype/deleteCommunityHousetype',
                data: {
                    id: id,
                    communityDetailId: communityDetailId
                },
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function (info) {
                    console.log(info);
                    if (info.result == '1') {
                        publicJs.openPromptBox('删除成功！');
                        publicJs.closePromptBox();


                        renderHouseType(communityDetailId);

                    }
                },
                error: function () {
                    $('.zhezhao').css('z-index', '900');
                    publicJs.openPromptBox('网络异常！');
                    publicJs.closePromptBox1();
                }
            })
        },

        //多图片上传预览功能
        setImagePreviews: function (inputId, imgBoxId) {
            var docObj = document.getElementById(inputId);
            var dd = document.getElementById(imgBoxId);
            dd.innerHTML = "";
            var fileList = docObj.files;
            for (var i = 0; i < fileList.length; i++) {

                dd.innerHTML += "<img id='img" + i + "' />";
                var imgObjPreview = document.getElementById("img" + i);
                if (docObj.files && docObj.files[i]) {
                    //火狐下，直接设img属性
                    imgObjPreview.style.display = 'inline-block';
                    imgObjPreview.style.width = '40px';
                    imgObjPreview.style.height = '30px';
                    //imgObjPreview.src = docObj.files[0].getAsDataURL();
                    //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                    imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
                }
                else {
                    //IE下，使用滤镜
                    docObj.select();
                    var imgSrc = document.selection.createRange().text;
                    alert(imgSrc);
                    var localImagId = document.getElementById("img" + i);
                    //必须设置初始大小
                    localImagId.style.width = "40px";
                    localImagId.style.height = "30px";
                    //图片异常的捕捉，防止用户修改后缀来伪造图片
                    try {
                        localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                        localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                    }
                    catch (e) {
                        alert("您上传的图片格式不正确，请重新选择!");
                        return false;
                    }
                    imgObjPreview.style.display = 'none';
                    document.selection.empty();
                }
            }

            return true;
        },
        //建立一個可存取到該file的url
        getObjectURL: function (file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }
        /*params: {
            fileInput: $("#addProjectImg").get(0),
            upButton: $("#addProjectBtn").get(0),
            url: urlHead + '/Community/addCommunity',
            // 对选择的文件进行过滤
            filter: function (files) {
                var arrFiles = [];
                for (var i = 0, file; file = files[i]; i++) {
                    if (file.type.indexOf("image") == 0) {
                        if (file.size >= 512000) {
                            alert('您这张"' + file.name + '"图片大小过大，应小于500k');
                        } else {
                            arrFiles.push(file);
                        }
                    } else {
                        alert('文件"' + file.name + '"不是图片。');
                    }
                }
                return arrFiles;
            },
            // 文件（这里就是图片）选择后执行的方法。onSelect方法的主要任务就是本地图片在浏览器中的预览
            onSelect: function (files) {
                var html = '',
                    i = 0;
                //等待载入gif动画
                $("#preview").html('<div class="upload_loading"></div>');
                var funAppendImage = function () {
                    file = files[i];
                    if (file) {
                        var reader = new FileReader()
                        reader.onload = function (e) {
                            html = html + '<div id="uploadList_' + i +
                                '" class="upload_append_list"><p><strong>' + file.name + '</strong>' +
                                '<a href="javascript:" class="upload_delete" title="删除" data-index="' +
                                i + '">删除</a><br />' +
                                '<img id="uploadImage_' + i + '" src="' + e.target.result +
                                '" class="upload_image" width="40px" height="30px" /></p>' +
                                '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
                                '</div>';

                            i++;
                            funAppendImage();
                        }
                        reader.readAsDataURL(file);
                    } else {
                        //图片相关HTML片段载入
                        $("#preview").html(html);
                        if (html) {
                            //删除方法
                            $(".upload_delete").click(function () {
                                ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                                return false;
                            });
                            //提交按钮显示
                            $("#addProjectBtn").show();
                        } else {
                            //提交按钮隐藏
                            $("#addProjectBtn").hide();
                        }
                    }
                };
                //执行图片HTML片段的载人
                funAppendImage();
            },
            // 图片上传完毕或是删除之时执行此方法
            onDelete: function (file) {
                $("#uploadList_" + file.index).fadeOut();
            },
            // 当前图片上传成功后执行的方法
            onSuccess: function (file, response) {
                $("#uploadInf").append("<p>上传成功，图片地址是：" + response + "</p>");
            },
            // 图片上传嗝屁时尿出的方法
            onFailure: function (file) {
                $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");
                $("#uploadImage_" + file.index).css("opacity", 0.2);
            },
            // 当所有图片都上传完毕之后，把file控件的value值置空，同时按钮隐藏
            onComplete: function () {
                //提交按钮隐藏
                $("#addProjectBtn").hide();
                //file控件value置空
                $("#fileImage").val("");
                $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
            }
        }*/

    };





    function dateFormat(time) {//日期格式
        var unixTimestamp = new Date(time);
        Date.prototype.toLocaleString = function () {
            // var minutes = this.getMinutes() <= 10 ? "0" + this.getMinutes() : this.getMinutes();
            // return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + minutes;
            return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + "";
        };
        var commonTime = unixTimestamp.toLocaleString();
        return commonTime;
    }

    //点击每一列楼盘显示相应的户型
    $(document).on("click", ".insideProjectHouseClick", function () {

        var insideProjectHouseId = $(this).attr("id");
        var communityId = $(this).attr("data-communityId");

        $(".removeTr2").remove();
        if ($(this).attr("data-num") == "3") {

            $(this).after(
                `<tr class="insideProjectHouseType removeTr2">
                    <td  scope="col" colspan="11" >
                        <table>
                            <thead>
                            <tr style="">
                                <th scope="col" colspan="11" style="text-align:left;background: #ace3f5;"><a class="insideProjectHouseTypeAdd" data-communityDetailId="${insideProjectHouseId}" data-communityId1="${communityId}">添加户型</a></th>
                            </tr>
                            <tr style="background: #e8e8e8">
                                <th>序号</th>
                                <th>户型</th>
                                <th>户型图</th>
                                <th>户型面积（m²）</th>
                                <th>总价（万）</th>
                                <th>单价（万）</th>
                                <th>推荐金</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody class="type">
                            
                            </tbody>
                        </table>
                    </td>
                </tr>`
            );

            renderHouseType($(this).attr("id"));

            $(this).attr("data-num", "4");
            $(this).siblings().attr("data-num", "3");
        } else {
            $('.insideProjectHouseType').hide();
            $(this).attr("data-num", "3");
            $(this).siblings().attr("data-num", "3");
        }
    });
    function renderHouseType(communityDetailId) {
        $.ajax({
            type: 'post',
            url: urlHead + "/CommunityHousetype/getHouseTypesByCommunityId",
            data: {
                communityDetailId: communityDetailId,
            },
            dataType: 'json',
            xhrFields: { withCredentials: true },
            success: function (data) {
                info = data.object;
                if (data.result == "1") {

                    var html = '';

                    for (var i = 0; i < info.length; i++) {
                        html += `<tr data-id="${info[i].id}">
                                <td>${i + 1}</td>
                                <td>${info[i].typeDatail}</td>
                                <td><img src="${ urlImg}/images/communitytype/${info[i].typeImgurl}"  width="30px" height="20px" style="margin-top:10px" alt=""></td>
                                <td>${info[i].typeArea}</td>
                                <td>${info[i].communityTotalPrice}</td>
                                <td>${info[i].communityUnitPrice}</td>
                                <td class="do" style="display:${info[i].type == "0" ? 'block' : 'none'}">${info[i].typeCommision}元</td>
                                <td class="do" style="display:${info[i].type == "1" ? 'block' : 'none'}">${info[i].typeCommision}%</td>
                                <td>
                                    <button class="insideProjectModify">修改</button>&nbsp;
                                    <button class="insideProjectDelate">删除</button>
                                </td>
                            </tr>`

                    }


                    $(".insideProject .type").html(html);

                }
            }
        });
    }


    //点击每一列项目显示相应的楼盘
    $(document).on("click", ".insideProjectclick", function () {
        var insideProjectID = $(this).attr("id");
        $(".removeTr").remove();
        if ($(this).attr("data-num") == "1") {
            $(this).after(
                `<tr class="insideProjectHouse removeTr" >
                                <td  scope="col" colspan="10">
                                    <table >
                                        <thead>
                                        <tr>
                                            <th scope="col" colspan="11" style="text-align:left;background: #6dceed;"><a class="insideProjectHouseAdd" data-id="${ insideProjectID}">添加楼盘</a></th>
                                        </tr>
                                        <tr style="background: #e8e8e8">
                                            <th>序号</th>
                                            <th>楼盘</th>
                                            <th>销售商</th>
                                            <th>建筑类型</th>
                                            <th>面积范围（m²）</th>
                                            <th>户型范围</th>
                                            <th>单价范围（万）</th>
                                            <th>总价范围（万）</th>
                                            <th>开盘日期</th>
                                            <th>交房日期</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody class="house">
                                    
                                        </tbody>
                                    </table>
                                </td>
                            </tr>`
            );

            renderCommunity($(this).attr("id"));

            $(this).attr("data-num", "2");
            $(this).siblings().attr("data-num", "1");
        } else {
            $('insideProjectHouse').hide();
            $(this).attr("data-num", "1");
            $(this).siblings().attr("data-num", "1");
        }
    });
    function renderCommunity(communityId) {
        $.ajax({
            type: 'post',
            // url: urlHead + "/CommunityDetail/findCommunityDetailDto",
            url: urlHead + "/CommunityDetail/findCommunityDetailByCommunityId",
            data: {
                communityId: communityId,
            },
            dataType: 'json',
            xhrFields: { withCredentials: true },
            success: function (data) {
                info = data.object;
                if (data.result == "1") {

                    var html = '';

                    for (var i = 0; i < info.length; i++) {

                        var detailStatus = "";
                        switch (info[i].detailStatus) {
                            case '0':
                                detailStatus = "下线";
                                break;
                            case '1':
                                detailStatus = "上线";
                        }

                        html += `<tr data-id="" class="insideProjectHouseClick" id="${info[i].communityDetailId}" data-communityId="${info[i].communityId}" data-num="3">
                            <td>${i + 1}</td>
                            <td>${info[i].detailName}</td>
                            <td>${info[i].companyName}</td>
                            <td>${info[i].builDingType}</td>
                            <td>${info[i].houseProportionRange}</td>
                            <td>${info[i].houseTypeRange}</td>
                            <td>${info[i].houseSp}</td>
                            <td>${info[i].averagePrice}</td>
                            <td>${dateFormat(info[i].latestSaleTime.time)}</td>
                            <td>${dateFormat(info[i].firstHandTime.time)}</td>
                            <td>
                            <button class="insideProjectModify">修改</button>&nbsp;
                            <button class="insideProjectUpOrDown">${detailStatus}</button>&nbsp;
                            <button class="insideProjectDelate">删除</button>
                            </td>
                            </tr>`
                    }


                    $(".insideProject .house").html(html);

                }
            }
        });
    }


    //分页
    var page = 1;
    paging();
    function paging() {
        // 上一页
        $(".paging .upPage").click(function () {
            if (page <= 1) {
                page = 1;
            } else {
                page -= 1;
            }
            $('.paging .nowPage').html(page);
            insideProject();
        });

        // 下一页
        $(".paging .downPage").click(function () {
            // if(page>=4){
            //     page=4;
            // }else{
            page += 1;
            // }
            $(".paging .nowPage").html(page);
            insideProject();
        });

        // 跳页
        $(".paging .yes").click(function () {
            if ($(".paging .jumpPage input").val() - 0 >= 1 && $(".paging .jumpPage input").val() - 0 <= 4) {
                page = $(".paging .jumpPage input").val() - 0;
                $(".paging .nowPage").html(page);
                insideProject();
            }
        });
    }

    //默认进页面加载数据列表
    insideProject();
    function insideProject() {
        $.ajax({
            type: 'post',
            url: urlHead + "/Community/findAllCommunity",
            // url: urlHead + "/Community/findByScreen",
            data: {
                page: page,
                rows: "5"
            },
            dataType: 'json',
            xhrFields: { withCredentials: true },
            success: function (data) {
                info = data.object.data;
                $(".insideProject table:first-child tbody").html("");

                if (data.result == "1") {
                    $(".insideProject .paging").attr("data-totalPage", Math.ceil(data.object.totalNumber / data.object.pageSize));


                    for (var i = 0; i < info.length; i++) {

                        $(".insideProject table:first-child tbody").append(
                            `<tr data-id='${info[i].id}' class="insideProjectclick" style="background: #e6e6e6" id="${info[i].id}"  data-num="1">
                            <td>${ (i + 1)}</td>
                            <td>${ info[i].name}</td>
                            <td><img src="${ urlImg}/images/carouselFigure/${info[i].surface}" width="30px" height="20px" style="margin-top:10px" /></td>
                            <td>${ info[i].provinceName} ,  ${info[i].cityName} ,  ${info[i].countyName} , ${info[i].address}</td>
                            <td>${ info[i].devloper}</td>
                            <td  class="projectDetail">详情</td>
                            <td class="PropertyCompany">${ info[i].propertyName}</td>
                            <td  class="community">详情</td>
                            <td>${ dateFormat(info[i].communityAddtime.time)}</td>
                            <td>
                            <button class="insideProjectModify">修改</button>&nbsp
                            <button class="insideProjectDelate">删除</button>
                            </td>
                            </tr>`
                        )

                    }

                }
            }
        });

    }

    // 删除
    $(document).on('click', '.insideProjectDelate', function (e) {
        e.stopPropagation();
        publicJs.openPromptBox('此功能正在进行中……');
        publicJs.closePromptBox();
    })


    /*-----------------------------------------------------------------------------*/

    // 添加所有物业公司、销售商
    prompt.addProperty();
    prompt.addSellers();

    /*------------------------------------添加项目----------------------------*/

    // 添加项目显示页面
    $('.insideProjectAdd').click(function () {
        $('.zhezhao').show();
        $('.prompt .addProject').show();
    })// 添加项目提交
    $('.prompt .addProjectBtn').click(function () {
        if ($(".prompt #addProjectForm .projectName").val() != '' &&
            $(".prompt #addProjectForm .devloper").val() != '' &&
            $(".prompt #addProjectForm .sheng").val() != '' &&
            $(".prompt #addProjectForm .shi").val() != '' &&
            $(".prompt #addProjectForm .qu").val() != '' &&
            $(".prompt #addProjectForm .address").val() != '' &&
            $(".prompt #addProjectForm .sellingPoint").val() != '' &&
            $(".prompt #addProjectForm .periPhery").val() != '' &&
            $(".prompt #addProjectForm .details").val() != '' &&
            $(".prompt #addProjectForm .builders").val() != ''
        ) {
            var formdata = new FormData(document.getElementById('addProjectForm'));
            prompt.addProject(formdata);
        }
    })

    /*------------------------------------修改项目----------------------------*/

    // 修改项目显示页面
    $(document).on('click', '.insideProjectclick .insideProjectModify', function (e) {
        e.stopPropagation();
        var projectId = $(this).closest('tr').attr('data-id');
        prompt.selectImg(projectId, prompt.addImgList);
        prompt.selectProject(projectId);
        $('.zhezhao').show();
        $('.prompt .updateProject').show();
        $('.prompt #updateImgForm').append('<input type=hidden name="configId" class=hide value=' + projectId + '>');
        $('.prompt #updateProjectForm .hide').val(projectId);
    })
    // 修改项目
    $(document).on('click', '.prompt #updateProjectForm .updateProjectBtn', function () {
        if ($(".prompt #updateProjectForm .projectName").val() != '' &&
            $(".prompt #updateProjectForm .devloper").val() != '' &&
            $(".prompt #updateProjectForm .sheng").val() != '' &&
            $(".prompt #updateProjectForm .shi").val() != '' &&
            $(".prompt #updateProjectForm .qu").val() != '' &&
            $(".prompt #updateProjectForm .address").val() != '' &&
            $(".prompt #updateProjectForm .sellingPoint").val() != '' &&
            $(".prompt #updateProjectForm .periPhery").val() != '' &&
            $(".prompt #updateProjectForm .details").val() != '' &&
            $(".prompt #updateProjectForm .builders").val() != ''
        ) {
            var updateForm = new FormData(document.getElementById('updateProjectForm'));
            prompt.updateProject(updateForm);
        }
    })
    // 项目介绍
    $(document).on('click', '.insideProjectclick .projectDetail', function (e) {
        e.stopPropagation();
        $('.zhezhao').show();
        $('.prompt .detail').show();
        e.stopPropagation();

        var projectId = $(this).closest('tr').attr('data-id');
        console.log(projectId);
        prompt.selectProject(projectId);
    })

    /*------------------------------------添加、删除轮播图-------------------------*/

    // 添加轮播图预览
    $('#addProjectImg').change(function () {
        prompt.setImagePreviews('addProjectImg', 'imgBox');
    });
    // 添加轮播图
    $(document).on('change', '.prompt #updateImgForm .fileImg .carouselFigureImg', function () {
        var addImgData = new FormData(document.getElementById('updateImgForm'));
        prompt.addImg(addImgData);
    })
    // 删除轮播图
    $(document).on('click', '.prompt .updateProject .xg ul li .updateImgBtn .carouselFigureImg', function () {
        var id = $(this).attr('data-id');
        prompt.deleteImg(id);
    })

    /*-----------------------------------添加楼盘---------------------------------*/

    // 添加楼盘显示页面
    $(document).on('click', '.insideProjectHouseAdd', function () {
        $('.zhezhao').show();
        $('.prompt .addHouses').show();
        $('.prompt #addCommunityDetailForm .communityId').val($(this).attr('data-id'));
    })
    function joinLink(txt1, txt2) {
        return $('.prompt ' + txt1).val() + '-' + $('.prompt ' + txt2).val();
    }
    function splitLink(txt) {
        return txt.split('-');
    }
    //添加楼盘点击事件
    $('.prompt .addCommunityDetailBtn').click(function () {
        $('.prompt #addCommunityDetailForm .houseProportionRange').val(joinLink('.houseProportionRange1', '.houseProportionRange2'));
        $('.prompt #addCommunityDetailForm .houseTypeRange').val(joinLink('.houseTypeRange1', '.houseTypeRange2'));
        $('.prompt #addCommunityDetailForm .houseSp').val(joinLink('.houseSp1', '.houseSp2'));
        $('.prompt #addCommunityDetailForm .averagePrice').val(joinLink('.averagePrice1', '.averagePrice2'));

        var addDateForm = new FormData(document.getElementById('addCommunityDetailForm'));
        prompt.addCommunityDetail(addDateForm, $('.prompt #addCommunityDetailForm .communityId').val());
    });

    /*-----------------------------------修改楼盘---------------------------------*/

    // 修改楼盘页面显示
    $(document).on('click', '.insideProjectHouseClick .insideProjectModify', function (e) {
        e.stopPropagation();
        var id = $(this).closest('tr').attr('id');
        prompt.selectCommunity(id);
        $('.zhezhao').show();
        $('.prompt .updateHouses').show();
    })
    // 修改楼盘
    $(document).on('click', '.prompt #updateCommunityDetailForm .updateCommunityDetailBtn', function (e) {
        e.stopPropagation();

        $('.prompt #updateCommunityDetailForm .houseProportionRange').val(joinLink('.houseProportionRange3', '.houseProportionRange4'));
        $('.prompt #updateCommunityDetailForm .houseTypeRange').val(joinLink('.houseTypeRange3', '.houseTypeRange4'));
        $('.prompt #updateCommunityDetailForm .houseSp').val(joinLink('.houseSp3', '.houseSp4'));
        $('.prompt #updateCommunityDetailForm .averagePrice').val(joinLink('.averagePrice3', '.averagePrice4'));

        var formdata = new FormData(document.getElementById('updateCommunityDetailForm'));
        prompt.updateCommunity(formdata, $('.prompt #updateCommunityDetailForm .communityId').val());
        // $('.zhezhao').show();
        // $('.prompt .updateHouses').show();
    })
    //修改状态
    $(document).on('click', '.insideProjectHouseClick .insideProjectUpOrDown', function (e) {
        e.stopPropagation();
        var id = $(this).closest('tr').attr('id');
        if ($('.insideProjectUpOrDown').text() == '上线') {
            prompt.updateCommunityStatus(id, 0);
        } else if ($('.insideProjectUpOrDown').text() == '下线') {
            prompt.updateCommunityStatus(id, 1);
        }

    })

    /*-----------------------------------添加户型---------------------------------*/

    // 添加户型显示页面
    $(document).on('click', '.insideProjectHouseTypeAdd', function () {
        $('.zhezhao').show();
        $('.prompt .addHouseType').show();
    });
    // 单选按钮
    $(document).on('click', '.prompt .type1', function () {
        $(this).attr('checked', 'true');
        $('.typeCommision1').attr('name', 'typeCommision');
        $('.typeCommision1').removeAttr('disabled');
        $('.typeCommision2').removeAttr('name');
        $('.prompt .type2').removeAttr('checked');
        $('.typeCommision2').attr('disabled', 'true');
        $('.typeCommision2').val('');
        // $('.typeCommision').val($('.typeCommision1').val());
    })
    $(document).on('click', '.prompt .type2', function () {
        $(this).attr('checked', 'true');
        $('.typeCommision2').attr('name', 'typeCommision');
        $('.typeCommision2').removeAttr('disabled');
        $('.typeCommision1').removeAttr('name');
        $('.prompt .type1').removeAttr('checked');
        $('.typeCommision1').attr('disabled', 'true');
        $('.typeCommision1').val('');
        // $('.typeCommision').val($('.typeCommision2').val());
    })

    // 添加户型
    $(document).on('click', '.prompt #addHouseType .addHouseTypeBtn', function () {
        console.log($('.prompt #addHouseType input[name="type"]:checked').val());
        if ($('.prompt #addHouseType input[name="type"]:checked').val() == '0') {
            $('.typeCommision').val($('.typeCommision1').val());
        } else if ($('.prompt #addHouseType input[name="type"]:checked').val() == '1') {
            $('.typeCommision').val($('.typeCommision2').val());
        }
        $('.prompt #addHouseType .communityId').val($('.insideProjectHouseTypeAdd').attr('data-communityid1'));
        $('.prompt #addHouseType .communityDetailId').val($('.insideProjectHouseTypeAdd').attr('data-communitydetailid'));

        var formdata = new FormData(document.getElementById('addHouseType'));
        prompt.addHouseType(formdata, $('.prompt #addHouseType .communityDetailId').val());
    })

    /*-----------------------------------修改、删除户型---------------------------------*/

    // 修改户型显示页面
    $(document).on('click', '.insideProjectHouseType .insideProjectModify', function () {
        var houseTypeId = $(this).closest('tr').attr('data-id');
        prompt.selectHouseType(houseTypeId);
        $('.zhezhao').show();
        $('.prompt .updateHouseType').show();
    })
    // 修改户型
    $(document).on('click', '.prompt #updateHouseType .updateHouseTypeBtn', function () {
        var formdata = new FormData(document.getElementById('updateHouseType'));
        prompt.updateHouseType(formdata, $('.prompt #updateHouseType .communityDetailId').val());
    })
    // 删除户型
    $(document).on('click', '.insideProjectHouseType .type .insideProjectDelate', function (e) {
        e.stopPropagation();
        var houseTypeId = $(this).closest('tr').attr('data-id');
        var communityDetailId = $('.insideProjectHouseTypeAdd').attr('data-communitydetailid');
        console.log(houseTypeId, communityDetailId)
        prompt.deleteHouseType(houseTypeId, communityDetailId);
    })

    /*-----------------------------------关闭按钮---------------------------------*/

    // 关闭按钮
    $('.close').click(function () {
        $('.zhezhao').hide();
        $('.prompt .addProject').hide();
        $('.prompt .updateProject').hide();
        $('.prompt .detail').hide();
        $('.prompt .addHouses').hide();
        $('.prompt .updateHouses').hide();
        $('.prompt .addHouseType').hide();
        $('.prompt .updateHouseType').hide();

        // 重置表单、轮播图、三级插件
        $('#addProjectForm')[0].reset();
        $('#imgBox').html('');
        $("#distpicker1").distpicker('reset', true);
        $("#updateProjectForm").find('.hide').remove();
        $("#updateImgForm").find('.hide').remove();
        $('.prompt #addHouseType .fileImg').css({ "background": "url(../img/up.png) no-repeat", "background-size": "100% 100%" })

        $('.prompt #updateHouseType')[0].reset();
        $('.prompt #updateHouseType .type1').removeAttr('checked');
        $('.prompt #updateHouseType .type1').removeAttr('name');
        $('.prompt #updateHouseType .type2').removeAttr('checked');
        $('.prompt #updateHouseType .type2').removeAttr('name');
        $('.typeCommision1').removeAttr('disabled');
        $('.typeCommision2').removeAttr('disabled');
    });


    /*-----------------------------------改变上传图片背景--------------------------------*/

    $('.fileImg #addHouseImg').change(function () {
        var urlImg = prompt.getObjectURL(this.files[0]);
        console.log(urlImg);
        $(this).parent('.fileImg').css({ "background": "url(" + urlImg + ") no-repeat", "background-size": "100% 100%" });
    });

    $('#updateHouseImg').change(function () {
        $(this).parent('.fileImg').css({ "background": "url(" + urlImg + ") no-repeat", "background-size": "100% 100%" });
    });

    $('#updateHouseImg').change(function () {
        var urlImg = getObjectURL(this.files[0]);
        console.log(urlImg);
        $(this).parent('.fileImg').css({ "background": "url(" + urlImg + ") no-repeat", "background-size": "100% 100%" });
    });



    /*-----------------------------------省市区三级联动--------------------------------*/

    // 初始化省市区
    $("#distpicker1").distpicker('reset', true);

    // 省市区三级联动
    $('#sheng1').change(function () {
        prompt.setCityCode('#addSheng', '#addShi', '#addQu', 1);
    })
    $('#shi1').change(function () {
        prompt.setCityCode('#addSheng', '#addShi', '#addQu', 1);
    })
    $('#qu1').change(function () {
        prompt.setCityCode('#addSheng', '#addShi', '#addQu', 1);
    })
    $('#sheng2').change(function () {
        prompt.setCityCode('#updateSheng', '#updateShi', '#updateQu', 2);
    })
    $('#shi2').change(function () {
        prompt.setCityCode('#updateSheng', '#updateShi', '#updateQu', 2);
    })
    $('#qu2').change(function () {
        prompt.setCityCode('#updateSheng', '#updateShi', '#updateQu', 2);
    })



    // 验证表单
    publicJs.yanzheng(".prompt .projectName", /\S/);
    publicJs.yanzheng(".prompt .devloper", /\S/);
    publicJs.yanzheng(".prompt .sheng", /\S/);
    publicJs.yanzheng(".prompt .shi", /\S/);
    publicJs.yanzheng(".prompt .qu", /\S/);
    publicJs.yanzheng(".prompt .address", /\S/);
    publicJs.yanzheng(".prompt .sellingPoint", /\S/);
    publicJs.yanzheng(".prompt .periPhery", /\S/);
    publicJs.yanzheng(".prompt .details", /\S/);
    publicJs.yanzheng(".prompt .builders", /\S/);



    /*-----------------------------------日期插件---------------------------------*/

    // 日期选择插件参数
    var dateParams = {
        type: "date",   //模式，time: 带时间选择; date: 不带时间选择;
        stamp: false,   //是否转成时间戳，默认true;
        offset: [0, 2],   //弹框手动偏移量;
        format: "yyyy-mm-dd",   //时间格式 默认 yyyy-mm-dd hh:ii;
        skin: '#5a98de',   //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
        step: 10,   //选择时间分钟的精确度;
        callback: function (v, e) { } //回调函数
    };
    // 日期选择插件
    $("#ECalendar_date1").ECalendar(dateParams);
    $("#ECalendar_date2").ECalendar(dateParams);
    $("#ECalendar_date3").ECalendar(dateParams);
    $("#ECalendar_date4").ECalendar(dateParams);

});



