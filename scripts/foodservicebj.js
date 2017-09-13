/**
 * ʳ食材管理
 * Created by Administrator on 2017/2/8.
 */
var $foodservice = {
    /*
     * 判断食材新鲜程度
     * */
    foodfresh: function ($endday, $productday) {
        var fresh = {
            "freshtext": '新鲜',
            "freshprogress": '80%',
            "freshclass": 'xinxian'
        };
        var curdate = (new Date()).Format("yyyy-MM-dd");//当前日期

        //$('body').append(curdate + ' - ' + productday + ' - ' + endday + ' - ' + DateDiff(curdate,productday) + '<br/>');
        //console.log(curdate + ' - ' + productday + ' - ' + endday + ' - ' + DateDiff(curdate,productday));
        var percent = 100;
        if (curdate >= $endday) {
            fresh = {
                "freshtext": '已过期',
                "freshprogress": percent + '%',
                "freshclass": 'guoqi'
            };
        } else {
            var $freshday = DateDiff($productday, $endday);
            percent = 100 - (Math.round(DateDiff(curdate, $productday) / $freshday * 10000) / 100.00);
            if ($freshday == 1) {
                fresh = {
                    "freshtext": '快过期',
                    "freshprogress": 32 + '%',
                    "freshclass": 'kuaiguoqi'
                };
            } else if ($freshday == 2) {
                fresh = {
                    "freshtext": '新鲜',
                    "freshprogress": 50 + '%',
                    "freshclass": 'xinxian'
                };
            } else {
                if (percent > 66.6) {
                    fresh = {
                        "freshtext": '新鲜',
                        "freshprogress": percent + '%',
                        "freshclass": 'xinxian'
                    };
                } else if (percent > 33.3) {
                    fresh = {
                        "freshtext": '正常',
                        "freshprogress": percent + '%',
                        "freshclass": 'zhengchang'
                    };
                } else {
                    fresh = {
                        "freshtext": '快过期',
                        "freshprogress": percent + '%',
                        "freshclass": 'kuaiguoqi'
                    };
                }
            }
        }
        //$('.main').append(JSON.stringify(fresh));
        //console.log(fresh);
        return fresh;
    },
    /*
     * 食材管理首页 - 食材过期提醒列表
     * */
    foodindex: function () {
        $('.shicai ul').empty();
        $apiservice.getfoodlist(-1, function (data) {
            var htmlstr = '';
            $.each(data.data.food_list, function (n, value) {
                var fresh = $foodservice.foodfresh(value.food_end_time, value.food_start_time);
                // console.log(value.fridge_food_id);
                // console.log(value.food_definition_id)
                htmlstr +=
                    '<li class="' + fresh.freshclass + '">' +
                    '     <a href="'+goDetail1(value.fridge_food_id,value.food_definition_id)+'">' +
                    '           <p class="img"><img src="' + value.food_image + '"/></p>' +
                    '           <div class="progress"><div class="progress-line" style="width: ' + fresh.freshprogress + ';"></div></div>' +
                    '           <div class="name">' + (value.food_name.length > 3 ? value.food_name.substring(0, 2) + '..' : value.food_name) + ' <span>' + fresh.freshtext + '</span></div>' +
                    '     </a>' +
                    '</li>';
            });
            $('.shicai ul').html(htmlstr);
            $('.shicai ul li').css('margin-bottom','20px','margin-top','2px');
        });
    },
    /*
     *冰箱食物加载
     * */
    foodlist: function () {
        $sobox.showMask('食材加载中');
        $apiservice.getfoodlist(-1, function (data) {
            $('#foodcount').html(data.data.food_list.length);
            var htmlstr = '';
            if (data.data.food_list.length > 0) {
                htmlstr = '<ul name="food-1" style="display:block;">';
                $.each(data.data.food_list, function (n, value) {
                    var fresh = $foodservice.foodfresh(value.food_end_time, value.food_start_time);
                    htmlstr +=
                        '<li class="' + fresh.freshclass + '">' +
                        '     <label class="input-radio-check" data-name="' + value.food_name + '" data-id="' + value.fridge_food_id + '"><input type="checkbox"/></label>' +
                        '     <a>' +
                        '           <p class="img"><img src="' + value.food_image + '"/></p>' +
                        '           <div class="progress"><div class="progress-line" style="width: ' + fresh.freshprogress + ';"></div></div>' +
                        '           <div class="name">' + (value.food_name.length > 3 ? value.food_name.substring(0, 2) + '..' : value.food_name) + ' <span>' + fresh.freshtext + '</span></div>' +
                        '     </a>' +
                        '</li>';
                });
                htmlstr += '</ul>';
            }
            else {
                htmlstr = '<ul name="food-1" class="nofood" style="display:block;"><li><img src="images/bg_foodadmin_nofood@3x.png"/></li></ul>'
            }
            $('.food-tab-con .shicai .fooditem').append(htmlstr);
            $sobox.hideMask();
        });
        setTimeout(function(){
         $apiservice.getfoodlist(1,function(data){
         var htmlstr = '';
         if(data.data.length > 0){
         htmlstr = '<ul name="food1">';
         $.each(data.data,function(n,value){
         var fresh = $foodservice.foodfresh(value.shelfLife,value.dateOfProduct);
         htmlstr +=
         '<li class="'+fresh.freshclass+'">'+
         '     <label class="input-radio-check" data-createTime="'+value.createTime+'" data-name="'+value.name+'" data-id="'+value.id+'" data-deviceid="'+value.deviceId+'" data-locationid="'+value.location+'"><input type="checkbox"/></label>'+
         '     <a>'+
         '           <p class="img"><img src="'+picUrl(value.imgUrl)+'"/></p>'+
         '           <div class="progress"><div class="progress-line" style="width: '+fresh.freshprogress+';"></div></div>'+
         '           <div class="name">'+(value.name.length>3?value.name.substring(0,2)+'..':value.name)+' <span>'+fresh.freshtext+'</span></div>'+
         '     </a>'+
         '</li>';
         });
         htmlstr += '</ul>';
         }
         else{
         htmlstr = '<ul name="food1" class="nofood"><li><img src="images/bg_foodadmin_nofood@3x.png"/></li></ul>'
         }
         $('.food-tab-con .shicai .fooditem').append(htmlstr);
         });
         },300);
         setTimeout(function(){
         $apiservice.getfoodlist(2,function(data){
         var htmlstr = '';
         if(data.data.length > 0){
         htmlstr = '<ul name="food2">';
         $.each(data.data,function(n,value){
         var fresh = $foodservice.foodfresh(value.shelfLife,value.dateOfProduct);
         htmlstr +=
         '<li class="'+fresh.freshclass+'">'+
         '     <label class="input-radio-check" data-createTime="'+value.createTime+'" data-name="'+value.name+'" data-id="'+value.id+'" data-deviceid="'+value.deviceId+'" data-locationid="'+value.location+'"><input type="checkbox"/></label>'+
         '     <a>'+
         '           <p class="img"><img src="'+picUrl(value.imgUrl)+'"/></p>'+
         '           <div class="progress"><div class="progress-line" style="width: '+fresh.freshprogress+';"></div></div>'+
         '           <div class="name">'+(value.name.length>3?value.name.substring(0,2)+'..':value.name)+' <span>'+fresh.freshtext+'</span></div>'+
         '     </a>'+
         '</li>';
         });
         htmlstr += '</ul>';
         }
         else{
         htmlstr = '<ul name="food2" class="nofood"><li><img src="images/bg_foodadmin_nofood@3x.png"/></li></ul>'
         }
         $('.food-tab-con .shicai .fooditem').append(htmlstr);
         });
         },500);
         setTimeout(function(){
         $apiservice.getfoodlist(4,function(data){
         var htmlstr = '';
         if(data.data.length > 0){
         htmlstr = '<ul name="food4">';
         $.each(data.data,function(n,value){
         var fresh = $foodservice.foodfresh(value.shelfLife,value.dateOfProduct);
         htmlstr +=
         '<li class="'+fresh.freshclass+'">'+
         '     <label class="input-radio-check" data-createTime="'+value.createTime+'" data-name="'+value.name+'" data-id="'+value.id+'" data-deviceid="'+value.deviceId+'" data-locationid="'+value.location+'"><input type="checkbox"/></label>'+
         '     <a>'+
         '           <p class="img"><img src="'+picUrl(value.imgUrl)+'"/></p>'+
         '           <div class="progress"><div class="progress-line" style="width: '+fresh.freshprogress+';"></div></div>'+
         '           <div class="name">'+(value.name.length>3?value.name.substring(0,2)+'..':value.name)+' <span>'+fresh.freshtext+'</span></div>'+
         '     </a>'+
         '</li>';
         });
         htmlstr += '</ul>';
         }
         else{
         htmlstr = '<ul name="food4" class="nofood"><li><img src="images/bg_foodadmin_nofood@3x.png"/></li></ul>'
         }
         $('.food-tab-con .shicai .fooditem').append(htmlstr);
         $sobox.hideMask();
         });
         },1000);
    },
    /*
     * 切换舱室冰箱内食材列表
     * paramer $locationid 舱室id 所有：-1，冷藏室：1，冷冻室：2，变温区：4
     * */
    togglefoodlist: function ($locationid, $this) {
        if ($this) {
            $this.removeClass('active').addClass('active').siblings('li').removeClass('active');
            $('.food-tab-con ul[name=food' + $locationid + ']').show().siblings('ul').hide();
            $('#foodcount').html($('.food-tab-con ul[name=food' + $locationid + '] li').length);
        }
    },
    /*
     * 切换删除模式
     * */
    toggleEditmodal: function ($this) {
        if ($('#foodcount').html() == '0') {
            return;
        }
        var $btn = $('.food-add-plus a');
        if ($this.hasClass('btn-delete')) {
            //开启删除模式
            $('.shicai ul .input-radio-check').show();
            $('.shicai ul input[type=checkbox]').each(function () {
                $(this).on('click', function () {
                    var dataId = $(this).parent().attr('data-id');
                    if ($(this).attr('checked')) {
                        $('.shicai ul li label[data-id=' + dataId + ']').each(function () {
                            $(this).removeClass('checked').addClass('checked');
                            $(this).children('input[type=checkbox]').prop('checked', true);
                        });
                    } else {
                        $('.shicai ul li label[data-id=' + dataId + ']').each(function () {
                            $(this).removeClass('checked');
                            $(this).children('input[type=checkbox]').prop('checked', false);
                        });
                    }
                });
            });
            $this.removeClass('btn-delete').addClass('btn-cancel').html('取消');
            $btn.removeAttr('href').html('点击删除食材').css('background-image', 'url(images/btn-dele.png)').attr('onclick', '$foodservice.deletefood()');

        }
        else {
            //关闭删除模式
            $('.shicai ul input[type=checkbox]').each(function () {
                $(this).prop('checked', false);
                $(this).parent().removeClass('checked').hide();
            });
            $('.shicai ul .input-radio-check').hide()
            $this.removeClass('btn-cancel').addClass('btn-delete').html('<img src="images/foodadmin_garbage@2x.png">');
            $btn.attr('href', 'foodinputbj.html').off('click').removeAttr('onclick').html('点击添加食材').css('background-image', 'url("images/btn-add.png")');
        }
    },
    /*
     * 删除冰箱内食材
     * */
    deletefood: function () {
        var fridgefoodids = '';
        $('.food-tab-con ul[name=food-1] .input-radio-check.checked').each(function () {
            var foodid = $(this).attr('data-id');
            if ($(this).hasClass('checked')) {
                fridgefoodids += foodid + ','
            }
        });

        $apiservice.batchfridgefoodDelete(fridgefoodids.substring(0, fridgefoodids.length - 1));
    },
    /********************************************************************/
    /*
     * 食材录入checkbox
     * */
    foodinputCheck: function () {
        $('.publicfood-tab-con .shicai .pbfood ul input[type=checkbox]').each(function () {
            $(this).on('click', function () {
                if ($(this).is(':checked')) {
                    $(this).parent().removeClass('checked');
                    $(this).parent().addClass('checked');
                } else {
                    $(this).prop('checked', false);
                    $(this).parent().removeClass('checked').hide();
                }
            });
        });
    },
    /*
     * 食材库 取消选中项 - 同步取消
     * */
    cancelpublicfood: function ($this, $name) {
        $('.publicfood-tab-con ul li label[data-id=' + $this.attr('data-id') + ']').removeClass('checked').hide();
        $this.parent().remove();
    },
    /*公共食材列表*/
    publicfoodlist: function () {
        $sobox.showMask('食材加载中');
        var catalogHtmlstr = '';
        $('.foodinput ul').empty();
        $apiservice.getpublichfood('', function (_data) {
            var allfood = _data.data.food_list;//全部食材
            $apiservice.getpubliccatalog(function (data) {
                $.each(data.data.food_category_list, function (n, value) {
                    var publicfoodHtmlstr = '';
                    var _prepublicfoodHtmlstr = '';
                    if (n == 0) {
                        catalogHtmlstr += '<li class="active" onclick="$foodservice.togglefoodcataloglist(' + (value.food_category_name != '全部' ? value.food_category_id : '-2') + ',$(this))"><a>' + value.food_category_name + '</a></li>';
                        _prepublicfoodHtmlstr = '<ul name="publicfood' + (value.food_category_name != '全部' ? value.food_category_id : '-2') + '" style="display:block;">';
                    }
                    else {
                        catalogHtmlstr += '<li onclick="$foodservice.togglefoodcataloglist(' + (value.food_category_name != '全部' ? value.food_category_id : '-2') + ',$(this))"><a>' + value.food_category_name + '</a></li>';
                        _prepublicfoodHtmlstr = '<ul name="publicfood' + (value.food_category_name != '全部' ? value.food_category_id : '-2') + '">';
                    }
                    var count = 0;
                    if (value.food_category_id == '-1') {
                        //常用食材
                        $apiservice.getpublichfood('-1', function (data2) {
                            $.each(data2.data.food_list, function (index, _value) {
                                count = index;
                                publicfoodHtmlstr += '<li onclick="$foodservice.publickfoodChoose($(this),\'' + _value.food_name + '\',\'' + _value.food_image + '\',\'' + _value.food_unit + '\',\'' + _value.food_definition_id + '\',' + value.food_category_id + index + ')">' +
                                    '<label class="input-radio-check" data-id="' + _value.food_definition_id + '"><input type="checkbox"/></label>' +
                                    '   <p class="img"><img src="' + _value.food_image + '"/></p>' +
                                    '   <div class="name">' + (_value.food_name.length > 3 ? _value.food_name.substring(0, 2) + '..' : _value.food_name) + '</div>' +
                                    '</li>';
                            });
                        });
                    }
                    else if (value.food_category_id == '') {
                        //全部食材
                        $.each(allfood, function (index, _value) {
                            count = index;
                            publicfoodHtmlstr += '<li onclick="$foodservice.publickfoodChoose($(this),\'' + _value.food_name + '\',\'' + _value.food_image + '\',\'' + _value.food_unit + '\',\'' + _value.food_definition_id + '\',' + value.food_category_id + index + ')">' +
                                '<label class="input-radio-check" data-id="' + _value.food_definition_id + '"><input type="checkbox"/></label>' +
                                '   <p class="img"><img src="' + _value.food_image + '"/></p>' +
                                '   <div class="name">' + (_value.food_name.length > 3 ? _value.food_name.substring(0, 2) + '..' : _value.food_name) + '</div>' +
                                '</li>';
                        });
                    }
                    else {
                        $.each(allfood, function (index, _value) {
                            if (_value.food_category_id == value.food_category_id) {
                                count = index;
                                publicfoodHtmlstr += '<li onclick="$foodservice.publickfoodChoose($(this),\'' + _value.food_name + '\',\'' + _value.food_image + '\',\'' + _value.food_unit + '\',\'' + _value.food_definition_id + '\',' + value.food_category_id + index + ')">' +
                                    '<label class="input-radio-check" data-id="' + _value.food_definition_id + '"><input type="checkbox"/></label>' +
                                    '   <p class="img"><img src="' + _value.food_image + '"/></p>' +
                                    '   <div class="name">' + (_value.food_name.length > 3 ? _value.food_name.substring(0, 2) + '..' : _value.food_name) + '</div>' +
                                    '</li>';
                            }
                        });
                    }
                    if (count <= 0) {
                        if (n == 0) {
                            _prepublicfoodHtmlstr = '<ul name="publicfood' + (value.food_category_name != '全部' ? value.food_category_id : '-2') + '" class="nofood" style="display:block;">';
                        }
                        else {
                            _prepublicfoodHtmlstr = '<ul name="publicfood' + (value.food_category_name != '全部' ? value.food_category_id : '-2') + '" class="nofood">';
                        }
                    }
                    $('.publicfood-tab-con .shicai .pbfood').append(_prepublicfoodHtmlstr + publicfoodHtmlstr + '</ul>');

                });
                $('.food-tab-nav .foodinput ul').html(catalogHtmlstr);
                $sobox.hideMask();
                if (window.addEventListener) {
                    simpScroller(document.querySelector(".food-tab-nav"), {
                        verticalScroll: false,
                        horizontalScroll: true,
                        hideScrollBar: true
                    });
                    simpScroller(document.querySelector(".publicfood"), {
                        verticalScroll: true,
                        horizontalScroll: false,
                        hideScrollBar: true,
                        onScrollStart: function (e) {
                            dropload.lock('up');
                        },
                        onScroll: function (e) {
                            dropload.lock('up');
                        },
                        onScrollEnd: function () {
                            dropload.unlock();
                        }
                    });
                }
            });
        }, function (msg) {
            $sobox.toastMsg(msg);
            $sobox.hideMask();
        });
    },
    /*
     * 公共食材选择
     * */
    publickfoodChoose: function ($this, $name, $pic, $shelflife, $foodid, $index) {
        if ($this.attr('checked')) {
            //取消选中
            $this.removeAttr('checked');
            $this.find('input[type=checkbox]').prop('checked', false);
            $this.find('input[type=checkbox]').parent().removeClass('checked').hide();

            $('.food-item2 ul li label[data-id=' + $foodid + ']').parent().remove();

        }
        else {
            //选择
            $this.attr('checked', 'checked');
            $this.find('input[type=checkbox]').prop('checked', true);
            $this.find('input[type=checkbox]').parent().addClass('checked').show();

            var num = $shelflife.substring(0, $shelflife.indexOf('-'));
            var danwei = $shelflife.substring($shelflife.indexOf('-') + 1) == 'd' ? '天' : $shelflife.substring($shelflife.indexOf('-') + 1) == 'm' ? '月' : '天';
            var htmlstr =
                '<li>' +
                '     <label id="shelf' + $index + '" class="food-dele" data-dateOfProduct="' + (new Date()).Format("yyyy-MM-dd") + '" data-id="' + $foodid + '" data-name="' + $name + '" data-shelflife="' + num + '" data-day1="' + danwei + '" data-img="' + $pic + '" title="点击删除" onclick="$foodservice.cancelpublicfood($(this),\'' + ($name.length > 3 ? $name.substring(0, 2) + '..' : $name) + '\')"></label>' +
                '     <div class="img" onclick="$foodservice.changefoodlife($(this))"><img src="' + $pic + '"/></div>' +
                '     <p>' + num + danwei + '</p>' +
                '</li>';
            $('.food-item2 ul').prepend(htmlstr).css('width', ($('.food-item2 ul li').length * 5) + 'rem');
        }
    },
    /*
     * 切换公共食材列表
     * */
    togglefoodcataloglist: function ($catalogid, $this) {
        if ($this) {
            $this.removeClass('active').addClass('active').siblings('li').removeClass('active');
            $('.publicfood-tab-con ul[name=publicfood' + $catalogid + ']').show().siblings('ul').hide();
        }
    },
    /*
     * 弹出食材保质期编辑窗
     * */
    changefoodlife: function ($this) {
        $('.dialog').show();
        var currYear = (new Date()).getFullYear();
        var $label = $this.parent().find('label');
        $('#changelifeimg').attr('src', $label.attr('data-img'));
        $('#changelifename').html($label.attr('data-name'));
        var dayofproduct = $label.attr('data-dateOfProduct');
        var freshday1 = $label.attr('data-shelflife');
        var freshday2 = $label.attr('data-day1');
        $('.dialog-btn-ok').attr('onclick', '$foodservice.setshelflife($(\'#' + $label.attr('id') + '\'))');

        var dd = dayofproduct.split('-');
        $("#appDate").val('').scroller({
            preset: 'date',
            theme: "android-ics light",
            lang: "zh",
            display: 'inline',
            dateFormat: 'yyyy-mm-dd',
            dateOrder:'yymmdd',
            showNow: true,
            defaultValue: new Date(dd[0],dd[1]-1,dd[2]),
            startYear: currYear - 5, //开始年份
            endYear: currYear, //结束年份
            formatResult:function(array){
                $('.dialog-btn-ok').attr('data-date',array[0] + '-' + (parseInt(array[1])+1) + '-' + array[2]);
            }
        });
        //$("#appDate").scroller('setDate', new Date(dayofproduct), true);

        var freshHtml = '';
        var dd = [];
        for (var d = 1; d < 100; d++) {
            if (d.toString().length == 1)
                freshHtml += '<li>0' + d.toString() + '</li>';
            else
                freshHtml += '<li>' + d.toString() + '</li>';
            dd.push(d);
        }
        $("#freshdy1").html(freshHtml);
        var j = ['天', '月', '年'];
        $("#freshdy1").mobiscroll().treelist({
            theme: "android-ics light",
            lang: "zh",
            display: 'inline',
            defaultValue: [dd.indexOf(parseInt(freshday1))],
            formatResult: function (array) {
                $('.dialog-btn-ok').attr('data-day', dd[parseInt(array[0])]);
            }
        });
        $("#freshdy2").mobiscroll().treelist({
            theme: "android-ics light",
            lang: "zh",
            display: 'inline',
            defaultValue: [j.indexOf(freshday2)],
            formatResult: function (array) {
                $('.dialog-btn-ok').attr('data-day1', j[parseInt(array[0])]);
            }
        });
    },
    setshelflife: function ($this) {
        if ($this) {
            var day1 = $('.dialog-btn-ok').attr('data-day');
            var day2 = $('.dialog-btn-ok').attr('data-day1');
            $this.attr('data-shelflife', day1);
            $this.attr('data-day1', day2);
            $this.parent().find('p').html(day1 + day2);
            $this.attr('data-dateOfProduct', $('.dialog-btn-ok').attr('data-date'));
        }
        $('.dialog').hide();
    },
    /*
     *添加食物到冰箱内
     * */
    batchfridgefood: function ($locationid, $action) {
        var fooditem = $('.food-input-bar .food-item2 ul li');
        if ($action == 'add') {
            var foodids = '';
            var addfridgefood = [];
            $.each(fooditem, function (n) {
                if ($(this).find('label').attr('data-name')) {
                    foodids += $(this).find('label').attr('data-id') + ',';
                    var danwei = $(this).find('label').attr('data-day1');
                    var food = {
                        "food_definition_id": $(this).find('label').attr('data-id'),
                        "food_start_time": $(this).find('label').attr('data-dateofproduct'),
                        "food_unit": $(this).find('label').attr('data-shelflife') + '-' + (danwei == '月' ? 'm' : danwei == '年' ? 'y' : 'd')
                    }
                    addfridgefood.push(food)
                }
            });
            $apiservice.batchfridgefoodAdd(foodids.substring(0, foodids.length - 1), addfridgefood);
        }
    },
    /*
     * 根据食材名搜索食材
     * */
    searchpublickfood: function ($name) {
        if ($name.length > 1) {
            $apiservice.searchpublicfoodByname($name, function (data) {
                $('.foodsearch .shicai ul').empty();
                if (data.data.food_list.length > 0) {
                    var htmlstr = '<ul>';

                    $('.noresult-notice').hide();
                    $.each(data.data.food_list, function (n, value) {
                        htmlstr += '<li onclick="$foodservice.searchfoodcallback(' + n + ',\'' + value.food_definition_id + '\',\'' + value.food_name + '\',\'' + value.food_unit + '\',\'' + value.food_image + '\')">' +
                            '<p class="img"><img src="' + value.food_image + '"/></p>' +
                            '<div class="name">' + value.food_name + '</div>' +
                            '</li>';
                    });
                    htmlstr += '</ul>';
                    $('.foodsearch .shicai').html(htmlstr);
                } else {
                    $('.foodsearch .shicai ul').empty();
                    $('.noresult-notice').show();
                }
            });
        }
    },
    searchfoodcallback: function ($index, $foodid, $name, $shelflife, $pic) {
        var $li = $('.publicfood-tab-con .shicai ul li label[data-name=' + $name + ']').parent();
        $li.attr('checked', 'checked');
        $li.find('input[type=checkbox]').prop('checked', true);
        $li.find('input[type=checkbox]').parent().addClass('checked').show();
        var num = $shelflife.substring(0, $shelflife.indexOf('-'));
        var danwei = $shelflife.substring($shelflife.indexOf('-') + 1) == 'd' ? '天' : $shelflife.substring($shelflife.indexOf('-') + 1) == 'm' ? '月' : '天';
        var htmlstr =
            '<li>' +
            '     <label id="shelf1' + $index + '" class="food-dele" data-dateOfProduct="' + (new Date()).Format("yyyy-MM-d") + '" data-id="' + $foodid + '" data-name="' + $name + '" data-shelflife="' + num + '" data-day1="' + danwei + '" data-img="' + $pic + '" title="点击删除" onclick="$foodservice.cancelpublicfood($(this),\'' + ($name.length > 3 ? $name.substring(0, 2) + '..' : $name) + '\')"></label>' +
            '     <div class="img" onclick="$foodservice.changefoodlife($(this))"><img src="' + $pic + '"/></div>' +
            '     <p>' + num + danwei + '</p>' +
            '</li>';
        $('.food-item2 ul').prepend(htmlstr).css('width', ($('.food-item2 ul li').length * 5) + 'rem');
        $('#foodsearch').hide();
        $('#foodinput').show();
    }
}
var accessToken = window.sessionStorage.getItem('accessToken');
var fridgeid = '201612011726098645';
var userid = '761607301828480002';
var $apiservice = {
    /*
     * 根据冰箱舱室获取冰箱食物
     * paramer $locationid 舱室id
     * */
    getfoodlist: function ($locationid, $success, $error) {
        var request = {
            "fridge_id": fridgeid,
            "user_id": userid,
            "current_page": 1,
            "page_size": 1000
        }
        $ajax.Post(URLS.GET_FOOD_LIST_BJ, JSON.stringify(createRequestData(request)), function (data) {
            console.log(data);
            if ($success)
                $success(data);
        }, function (msg) {
            if ($error)
                $error(msg);
            else
                $sobox.toastMsg(msg);
        })
    },
    /*
     * 删除冰箱内食物
     * */
    batchfridgefoodDelete: function ($param) {
        var requset = {
            "fridge_id": fridgeid,
            "user_id": userid,
            "fridge_food_ids": $param
        };
        $ajax.Post(URLS.DO_FOOD_DELETE_BJ, JSON.stringify(createRequestData(requset)), function (data) {
            location.reload();
        }, function (msg) {
            $sobox.toastMsg(msg);
        });
    },
    /*
     * 冰箱内食材添加
     * */
    batchfridgefoodAdd: function ($foodids, $foodlist) {
        var requset = {
            "fridge_id": fridgeid,
            "user_id": userid,
            "food_definition_ids": $foodids,
            "fridge_food_info": $foodlist
        };
        $ajax.Post(URLS.DO_FOOD_ADD_BJ, JSON.stringify(createRequestData(requset)), function (data) {
            window.sessionStorage.setItem('isback', '1');
            window.history.go(-1);
        }, function (msg) {
            $sobox.toastMsg(msg);
        });
    },
    /*
     * 获取冰箱公共食材目录
     * */
    getpubliccatalog: function ($success, $error) {
        var request = {
            "fridge_id": fridgeid,
            "user_id": userid
        };
        $ajax.Post(URLS.GET_FOOD_CATALOG_BJ, JSON.stringify(createRequestData(request)), function (data) {
            if ($success)
                $success(data);
        }, function (msg) {
            if ($error)
                $error(msg);
            else
                $sobox.toastMsg(msg);
        })
    },
    /*
     * 获取冰箱内的公共食材
     * paramer $catalogId 公共食材分类id
     * */
    getpublichfood: function ($catalogId, $success, $error) {
        var request = {
            "fridge_id": fridgeid,
            "user_id": userid,
            "current_page": 1,
            "page_size": 1000,
            "food_category_id": $catalogId
        };
        $ajax.Post(URLS.SEARCH_FOOD_CATALOG_BJ, JSON.stringify(createRequestData(request)), function (data) {
            if ($success)
                $success(data);
        }, function (msg) {
            if ($error)
                $error(msg);
            else
                $sobox.toastMsg(msg);
        })
    },
    /*
     * 批量处理用户自定义食材库
     * */
    bactchfridgefoodrepo: function () {
        var requset = {
            "data": {
                "url": ENV_HOST_PRE + URLS.BATCH_FRIDGEFOODS_REPO,
                "accessToken": accessToken,
                "deviceId": "ha7744188",
            }
        };
        $ajax.Post(URLS.BATCH_FRIDGEFOODS_REPO_N, JSON.stringify(requset), function (data) {
            //console.log(data);
        }, function (msg) {
            $sobox.toastMsg(msg);
        });
    },
    /*
     * 搜索冰箱公共食材
     * paramer $name 食材名称
     * */
    searchpublicfoodByname: function ($name, $success, $error) {
        var request = {
            "fridge_id": fridgeid,
            "user_id": userid,
            "current_page": 1,
            "page_size": 1000,
            "keyword": $name
        }
        $ajax.Post(URLS.SEARCH_FOOD_NAME_BJ, JSON.stringify(createRequestData(request)), function (data) {
            if ($success)
                $success(data);
        }, function (msg) {
            if ($error)
                $error(msg);
            $sobox.toastMsg(msg);
        })
    },
    /*
     * API申请授权，并且获取访问令牌(access_token)
     * */
    getApiAccesstoken: function () {
        var request = {
            "data": {
                "url": URLS.GET_ACCESS,
                "clientId": "unilife_standard_api_haier",
                "clientSecret": "unilife_standard_api_haier_123456"
            }
        }
        $ajax.Post(URLS.GET_ACCESSTOKEN, JSON.stringify(request), function (data) {
            window.sessionStorage.setItem('accessToken', data.data.access_token)
        }, function (msg) {
            $sobox.toastMsg(msg);
        });
    }
}

/**
 * 用户绑定设备 - 注册（短信验证码登录注册）
 * */
var $loginservice = {
    login: function () {
        //短信验证码登录
        if (!Valid.checkRequired($('#tel').val())) {
            $sobox.toastMsg('请输入手机号码');
            return;
        }
        if (!Valid.checkMobile($('#tel').val())) {
            $sobox.toastMsg('请输入正确的手机号码');
            return;
        }
        if (!Valid.checkRequired($('#code').val())) {
            $sobox.toastMsg('请输入验证码');
            return;
        }
        if (!$('#rdoxieyi').is(':checked')) {
            $sobox.toastMsg('请先阅读海尔用户使用协议');
            return;
        }
        var $data = {
            "phone": $('#tel').val(),
            "vercode": $('#code').val()
        };
        var isnew = $('#isnew').val();
        var url = URLS.DO_DYNAMIC_LOGIN;
        // if (isnew == '1') {
        //     $data = {
        //         "login_name": $('#tel').val(),
        //         "vercode": $('#code').val(),
        //         "registration_id": "",
        //         "device_token": "",
        //         "family_id": "",
        //         "fridge_id": ""
        //     };
        //     url = URLS.DO_DYNAMIC_LOGIN;
        // }
        $ajax.Post(url, JSON.stringify($data), function (data) {
            var openid = window.sessionStorage.getItem('openid');
            var request1 = {
                "data": {
                    "userId": data.data.user_id,
                    "openId": openid
                }
            }
            $ajax.Post(URLS.DO_BING_WXUSER, JSON.stringify(request1), function () {
                var request2 = {
                    "data": {
                        "openId": openid
                    }
                };
                $ajax.Post(URLS.GET_WXUSER_BYOPENID, JSON.stringify(request2), function (data) {
                    window.sessionStorage.setItem('user', data.data);
                    location.replace('devicechoose.html');
                });
            });
        }, function (msg, status) {
            if (status == '5010') {
                $sobox.toastMsg('验证码失效或者验证码错误');
            }
            else {
                $sobox.toastMsg(msg);
            }
        });
    },
    timeInterval: 0,
    timeLeft: 0,
    smsCode: function () {
        if (this.timeInterval == 0) {
            if (!Valid.checkRequired($('#tel').val())) {
                $sobox.toastMsg('请输入手机号码');
                return;
            }
            if (!Valid.checkMobile($('#tel').val())) {
                $sobox.toastMsg('请输入正确的手机号码');
                return;
            }
            var $data = {
                "data":{
                    "phone": $('#tel').val()
                }
            }
            var _this = this;
            $ajax.Post(URLS.DO_LOGIN_CKCODE, JSON.stringify($data), function (data) {
                $('#btnCKcode').attr('disabled', true).css('color', '#424242');
                _this.timeLeft = 60;
                _this.timeInterval = setInterval(function () {
                    _this.timeLeft--;
                    $('#btnCKcode').html('重发(' + _this.timeLeft + 's)');
                    if (_this.timeLeft == 0) {
                        // 终止
                        clearInterval(_this.timeInterval);
                        _this.timeInterval = 0;
                        $('#btnCKcode').html('重发验证码');
                        $('#btnCKcode').removeAttr('disabled').css('color', '#ff792f');
                    }
                }, 1000)
            }, function (msg, code, ok) {
                if (code == '5001' || code == '5002') {
                    clearInterval(_this.timeInterval);
                    if (code == '5001') {
                        $('#isnew').val('1');
                    }
                    $('#btnCKcode').attr('disabled', true).css('color', '#424242');
                    _this.timeLeft = 60;
                    _this.timeInterval = setInterval(function () {
                        _this.timeLeft--;
                        $('#btnCKcode').html('重发(' + _this.timeLeft + 's)');
                        if (_this.timeLeft == 0) {
                            // 终止
                            clearInterval(_this.timeInterval);
                            _this.timeInterval = 0;
                            $('#btnCKcode').html('重发验证码');
                            $('#btnCKcode').removeAttr('disabled').css('color', '#ff792f');
                        }
                    }, 1000)
                } else {
                    clearInterval(_this.timeInterval);
                    $('#btnCKcode').removeAttr('disabled').css('color', '#ff792f');
                    $sobox.toastMsg(msg);
                }
            });
        }
    },
    getopenid: function () {
        var code = $url.GetQueryString('code');
        //window.sessionStorage.setItem('openid', 'oWhkvwbmtlOF8CZoXFiDpIQJLmtw');//测试用
        var openid = window.sessionStorage.getItem('openid');
        if (!openid) {

            if (code) {
                $.get(URLS.GET_OPENID + '?code=' + code, function (data) {
                    //$('body').append(JSON.stringify(data.data));
                    //window.sessionStorage.setItem('openid','112');
                    if (data.code == '200') {
                        //$sobox.toastMsg(data.data.openid);
                        var request = {
                            "data": {
                                "openId": data.data.openid
                            }
                        };
                        $ajax.Post(URLS.GET_WXUSER_BYOPENID, JSON.stringify(request), function (data) {
                            window.sessionStorage.setItem('user', JSON.stringify(data.data));
                            $('#indexhref').attr('href', 'devicechoose.html?phoneNumber='+data.data.phone+'#');
                            if(isgo != 1)
                                location.replace('index.html?phoneNumber='+data.data.phone+'#&isgo=1');
                        }, function (msg, code) {
                            $('#indexhref').attr('href', 'binddevice.html');
                        });
                    } else {
                        $sobox.toastMsg(data.message);
                    }
                });
            }

        } else {
            var request = {
                "data": {
                    "openId": openid
                }
            };
            $ajax.Post(URLS.GET_WXUSER_BYOPENID, JSON.stringify(request), function (data) {
                window.sessionStorage.setItem('user', JSON.stringify(data.data));
                $('#indexhref').attr('href', 'devicechoose.html?phoneNumber='+data.data.phone+'#');
                if(isgo != 1)
                    location.replace('index.html?phoneNumber='+data.data.phone+'#&isgo=1');
            }, function (msg, code) {
                $('#indexhref').attr('href', 'binddevice.html');
            });
        }
    }
}


function picUrl($imgsrc) {
    var imgName = $imgsrc.substring($imgsrc.lastIndexOf('/'), $imgsrc.lastIndexOf('.'));
    var imgCatalog = $imgsrc.substring($imgsrc.lastIndexOf('.'));

    return 'http://fridge.unilifemedia.com:8100/pic/publicFood' + imgName + imgCatalog;
}

function goDetail(food_id,definition_id){
    location.href = 'fooddetail.html?v='+(Date.parse(new Date()))+'&fridge_food_id='+food_id+'&food_definition_id='+definition_id;
     console.log(food_id);
 }
 function goDetail1(food_id,definition_id){
     var a = null;
     a = 'fooddetail.html?v='+(Date.parse(new Date()))+'&fridge_food_id='+food_id+'&food_definition_id='+definition_id;
     return a ;
 }
 




