/**
 * ʳ食材管理
 * Created by Administrator on 2017/2/8.
 */
var $foodservice = {
    /*
    * 判断食材新鲜程度
    * */
    foodfresh:function($freshday,$productday){
        var fresh = {
            "freshtext":'新鲜',
            "freshprogress":'80%',
            "freshclass":'xinxian'
        };
        var curdate = (new Date()).Format("yyyy-MM-dd");//当前日期
        var productday = renderTime($productday,'yyyy-MM-dd');//生成日期
        var endday = addByTransDate(productday,$freshday);//保质期到期时间
		
		//$('body').append(curdate + ' - ' + productday + ' - ' + endday + ' - ' + DateDiff(curdate,productday) + '<br/>');
        //console.log(curdate + ' - ' + productday + ' - ' + endday + ' - ' + DateDiff(curdate,productday));
        var percent = 100;
        if(DateDiff(curdate,productday) >= $freshday){
            fresh = {
                "freshtext":'已过期',
                "freshprogress":percent+'%',
                "freshclass":'guoqi'
            };
        }else{
            percent = 100 - (Math.round(DateDiff(curdate,productday) / $freshday * 10000) / 100.00);
            if($freshday == 1){
                fresh = {
                    "freshtext":'快过期',
                    "freshprogress":32+'%',
                    "freshclass":'kuaiguoqi'
                };
            }else if($freshday == 2){
                fresh = {
                    "freshtext":'新鲜',
                    "freshprogress":50+'%',
                    "freshclass":'xinxian'
                };
            }else{
                if(percent > 66.6){
                    fresh = {
                        "freshtext":'新鲜',
                        "freshprogress":percent+'%',
                        "freshclass":'xinxian'
                    };
                }else if(percent > 33.3){
                    fresh = {
                        "freshtext":'正常',
                        "freshprogress":percent+'%',
                        "freshclass":'zhengchang'
                    };
                }else{
                    fresh = {
                        "freshtext":'快过期',
                        "freshprogress":percent+'%',
                        "freshclass":'kuaiguoqi'
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
    foodindex:function(){
        $('.shicai ul').empty();
        $apiservice.getfoodlist(-1,function(data){
            var htmlstr = '';
            $.each(data.data,function(n,value){
                var fresh = $foodservice.foodfresh(value.shelfLife,value.dateOfProduct);
                htmlstr +=
                    '<li class="'+fresh.freshclass+'">'+
                    '     <a>'+
                    '           <p class="img"><img src="'+picUrl(value.imgUrl)+'"/></p>'+
                    '           <div class="progress"><div class="progress-line" style="width: '+fresh.freshprogress+';"></div></div>'+
                    '           <div class="name">'+(value.name.length>3?value.name.substring(0,2)+'..':value.name)+' <span>'+fresh.freshtext+'</span></div>'+
                    '     </a>'+
                    '</li>';
            });
            $('.shicai ul').html(htmlstr);
        });
    },
    /*
    *冰箱食物加载
    * */
    foodlist:function(){
        $sobox.showMask('食材加载中');	
        $apiservice.getfoodlist(-1,function(data){
            $('#foodcount').html(data.data.length);
            var htmlstr = '';
            if(data.data.length > 0){
                htmlstr = '<ul name="food-1" style="display:block;">';
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
                htmlstr = '<ul name="food-1" class="nofood" style="display:block;"><li><img src="images/bg_foodadmin_nofood@3x.png"/></li></ul>'
            }
            $('.food-tab-con .shicai .fooditem').append(htmlstr);
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
        if($this){
            $this.removeClass('active').addClass('active').siblings('li').removeClass('active');
            $('.food-tab-con ul[name=food'+$locationid+']').show().siblings('ul').hide();			
			$('#foodcount').html($('.food-tab-con ul[name=food'+$locationid+'] li').length);
        }
    },
    /*
     * 切换删除模式
     * */
    toggleEditmodal: function ($this) {
		if($('#foodcount').html() == '0'){
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
                        $('.shicai ul li label[data-id='+dataId+']').each(function(){
                            $(this).removeClass('checked').addClass('checked');
                            $(this).children('input[type=checkbox]').prop('checked',true);
                        });
                    } else {
                        $('.shicai ul li label[data-id='+dataId+']').each(function(){
                            $(this).removeClass('checked');
                            $(this).children('input[type=checkbox]').prop('checked',false);
                        });
                    }
                });
            });
            $this.removeClass('btn-delete').addClass('btn-cancel').html('取消');
            $btn.removeAttr('href').html('点击删除食材').css('background-image', 'url(images/btn-dele.png)').attr('onclick','$foodservice.deletefood()');

        }
        else {
            //关闭删除模式
            $('.shicai ul input[type=checkbox]').each(function(){
                $(this).prop('checked',false);
                $(this).parent().removeClass('checked').hide();
            });
            $('.shicai ul .input-radio-check').hide()
            $this.removeClass('btn-cancel').addClass('btn-delete').html('<img src="images/foodadmin_garbage@2x.png">');
            $btn.attr('href', 'foodinput.html').off('click').removeAttr('onclick').html('点击添加食材').css('background-image', 'url("images/btn-add.png")');
        }
    },
    /*
     * 删除冰箱内食材
     * */
    deletefood: function () {
        var addfridgefood = [];
        $('.food-tab-con ul[name=food-1] .input-radio-check.checked').each(function () {
            var food = {
                "name":$(this).attr('data-name'),
                "createTime":$(this).attr('data-createTime'),
                "location":$(this).attr('data-locationid')
            }
            if($(this).hasClass('checked')){
                addfridgefood.push(food);
            }
        });
		
        $apiservice.batchfridgefood(addfridgefood,'del');
    },
    /********************************************************************/
    /*
    * 食材录入checkbox
    * */
    foodinputCheck: function () {
        $('.publicfood-tab-con .shicai ul input[type=checkbox]').each(function () {
            $(this).on('click', function () {
                if ($(this).is(':checked')) {
                    $(this).parent().removeClass('checked');
                    $(this).parent().addClass('checked');
                } else {
                    $(this).prop('checked',false);
                    $(this).parent().removeClass('checked').hide();
                }
            });
        });
    },
    /*
    * 食材库 取消选中项 - 同步取消
    * */
    cancelpublicfood:function($this,$name){
        $('.publicfood-tab-con ul li label[data-name='+$name+']').removeClass('checked').hide();
        $this.parent().remove();
    },
    /*公共食材列表*/
    publicfoodlist:function(){
        $apiservice.getpubliccatalog(function(data){
            $sobox.showMask('食材加载中');
            var catalogHtmlstr = '';
            $('.foodinput ul').empty();
            $.each(data.data,function(n,value){
                var publicfoodHtmlstr = '';
                if(n == 0){
                    catalogHtmlstr += '<li class="active" onclick="$foodservice.togglefoodcataloglist('+value.catalogId+',$(this))"><a>'+value.catalogName+'</a></li>';
                }
                else{
                    catalogHtmlstr += '<li onclick="$foodservice.togglefoodcataloglist('+value.catalogId+',$(this))"><a>'+value.catalogName+'</a></li>';
                }
                $apiservice.getpublichfood(value.catalogId,function(_data){
                    if(_data.data.length > 0){
                        if(n == 0){
                            publicfoodHtmlstr = '<ul name="publicfood'+value.catalogId+'" style="display:block;">';
                        }
                        else{
                            publicfoodHtmlstr = '<ul name="publicfood'+value.catalogId+'">';
                        }
                        $.each(_data.data,function(_n,_value){
                            publicfoodHtmlstr += '<li onclick="$foodservice.publickfoodChoose($(this),\''+_value.name+'\',\''+picUrl(_value.picUrl_l)+'\',\''+_value.shelfLife+'\','+n+')">'+
                                '<label class="input-radio-check" data-name="'+_value.name+'"><input type="checkbox"/></label>'+
                                '   <p class="img"><img src="'+picUrl(_value.picUrl_l)+'"/></p>'+
                                '   <div class="name">'+ (_value.name.length>3?_value.name.substring(0,2)+'..':_value.name) +'</div>'+
                                '</li>';
                        });
                    }
                    else{
						 if(n == 0){
                            publicfoodHtmlstr = '<ul name="publicfood'+value.catalogId+'" class="nofood" style="display:block;">';
                        }
                        else{
                            publicfoodHtmlstr = '<ul name="publicfood'+value.catalogId+'" class="nofood">';
                        }                        
                    }
                    publicfoodHtmlstr += '</ul>';
                    $('.publicfood-tab-con .shicai .pbfood').append(publicfoodHtmlstr);

                    if((n+1) == data.data.length){
                        $sobox.hideMask();
                    }
                });
            });
            $('.food-tab-nav .foodinput ul').html(catalogHtmlstr);
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
                    onScrollStart:function(e){
                        dropload.lock('up');
                    },
                    onScroll:function(e){
                        dropload.lock('up');
                    },
                    onScrollEnd:function(){
                        dropload.unlock();
                    }
                });
            }
        });
    },
    /*
    * 公共食材选择
    * */
    publickfoodChoose:function($this,$name,$pic,$shelflife,$index){
        if($this.attr('checked')){
            //取消选中
            $this.removeAttr('checked');
            $this.find('input[type=checkbox]').prop('checked',false);
            $this.find('input[type=checkbox]').parent().removeClass('checked').hide();

            $('.food-item2 ul li label[data-name='+$name+']').parent().remove();

        }
        else{
            //选择
            $this.attr('checked','checked');
            $this.find('input[type=checkbox]').prop('checked',true);
            $this.find('input[type=checkbox]').parent().addClass('checked').show();

            var htmlstr =
                '<li>'+
                '     <label id="shelf'+$index+'" class="food-dele" data-dateOfProduct="'+(new Date()).Format("yyyy-MM-d")+'" data-name="'+$name+'" data-shelflife="'+$shelflife+'" data-day="'+$shelflife+'" data-day1="天" data-img="'+$pic+'" title="点击删除" onclick="$foodservice.cancelpublicfood($(this),\''+($name.length>3?$name.substring(0,2)+'..':$name)+'\')"></label>'+
                '     <div class="img" onclick="$foodservice.changefoodlife($(this))"><img src="'+$pic+'"/></div>'+
                '     <p>'+$shelflife+'天</p>'+
                '</li>';
            $('.food-item2 ul').prepend(htmlstr).css('width',($('.food-item2 ul li').length*5)+'rem');
        }
    },
    /*
    * 切换公共食材列表
    * */
    togglefoodcataloglist: function ($catalogid, $this) {
        if($this){
            $this.removeClass('active').addClass('active').siblings('li').removeClass('active');
            $('.publicfood-tab-con ul[name=publicfood'+$catalogid+']').show().siblings('ul').hide();
        }
    },
    /*
    * 弹出食材保质期编辑窗
    * */
    changefoodlife:function($this){
        $('.dialog').show();
        var currYear = (new Date()).getFullYear();
        var $label = $this.parent().find('label');
        $('#changelifeimg').attr('src',$label.attr('data-img'));
        $('#changelifename').html($label.attr('data-name'));
        var dayofproduct = $label.attr('data-dateOfProduct');
        var freshday1 = $label.attr('data-day');
        var freshday2 = $label.attr('data-day1');
        $('.dialog-btn-ok').attr('onclick','$foodservice.setshelflife($(\'#'+$label.attr('id')+'\'))');

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
        for(var d = 1;d < 100;d++){
            if(d.toString().length == 1)
                freshHtml += '<li>0' + d.toString() + '</li>';
            else
                freshHtml += '<li>' + d.toString() + '</li>';
            dd.push(d);
        }
        $("#freshdy1").html(freshHtml);
        var j = ['天','月','年'];
        $("#freshdy1").mobiscroll().treelist({
            theme: "android-ics light",
            lang: "zh",
            display: 'inline',
            defaultValue: [dd.indexOf(parseInt(freshday1))],
            formatResult:function(array){
                $('.dialog-btn-ok').attr('data-day',dd[parseInt(array[0])]);
            }
        });
        $("#freshdy2").mobiscroll().treelist({
            theme: "android-ics light",
            lang: "zh",
            display: 'inline',
            defaultValue: [j.indexOf(freshday2)],
            formatResult:function(array){
                $('.dialog-btn-ok').attr('data-day1',j[parseInt(array[0])]);
            }
        });
    },
    setshelflife:function($this){
        if($this){
            var day1 = $('.dialog-btn-ok').attr('data-day');
            var day2 = $('.dialog-btn-ok').attr('data-day1');
            if(day2 == '月'){
                $this.attr('data-shelflife',parseInt(day1)*30);
                $this.parent().find('p').html(parseInt(day1)*30 + '天');
            }else if(day2 == '年'){
                $this.attr('data-shelflife',parseInt(day1)*365);
                $this.parent().find('p').html(parseInt(day1)*365 + '天');
            }else{
                $this.attr('data-shelflife',day1);
                $this.parent().find('p').html(day1 + '天');
            }
            $this.attr('data-dateOfProduct',$('.dialog-btn-ok').attr('data-date'));
            $this.attr('data-day',day1);
            $this.attr('data-day1',day2);
        }
        $('.dialog').hide();
    },
    /*
    *添加食物到冰箱内
    * */
    batchfridgefood:function($locationid,$action){
        var fooditem = $('.food-input-bar .food-item2 ul li');
        if($action == 'add'){
            var addfridgefood = [];
            $.each(fooditem,function(n){
				if($(this).find('label').attr('data-name')){
					var food = {
						"name":$(this).find('label').attr('data-name'),
						"shelfLife":$(this).find('label').attr('data-shelflife'),
						"dateOfProduct":new Date($(this).find('label').attr('data-dateofproduct')).getTime(),
						"createTime":new Date().getTime() + (n+1),
						"imgUrl":$(this).find('label').attr('data-img'),
						"location":$locationid
					}
					addfridgefood.push(food)
				}                
            });
			//console.log(JSON.stringify(addfridgefood));
			//return;
            $apiservice.batchfridgefood(addfridgefood,'add');
        }
        else if($action == ''){

        }

    },
    /*
    * 根据食材名搜索食材
    * */
    searchpublickfood:function($name){
        if($name.length > 1){
            $apiservice.searchpublicfoodByname($name,function(data){
                $('.foodsearch .shicai ul').empty();
                if(data.data.length > 0){
                    var htmlstr = '<ul>';

                    $('.noresult-notice').hide();
                    $.each(data.data,function(n,value){
                        htmlstr += '<li onclick="$foodservice.searchfoodcallback('+n+',\''+value.name+'\',\''+value.shelfLife+'\',\''+picUrl(value.picUrl_l)+'\')">'+
                            '<p class="img"><img src="'+picUrl(value.picUrl_l)+'"/></p>'+
                            '<div class="name">'+value.name+'</div>'+
                            '</li>';
                    });
                    htmlstr += '</ul>';
                    $('.foodsearch .shicai').html(htmlstr);
                }else{
					$('.foodsearch .shicai ul').empty();
                    $('.noresult-notice').show();
                }
            });
        }
    },
    searchfoodcallback:function($index,$name,$shelflife,$pic){
        var $li = $('.publicfood-tab-con .shicai ul li label[data-name='+$name+']').parent();
        $li.attr('checked','checked');
        $li.find('input[type=checkbox]').prop('checked',true);
        $li.find('input[type=checkbox]').parent().addClass('checked').show();
        var htmlstr =
            '<li>'+
            '     <label id="shelf1'+$index+'" class="food-dele" data-dateOfProduct="'+(new Date()).Format("yyyy-MM-d")+'" data-name="'+$name+'" data-shelflife="'+$shelflife+'" data-day="'+$shelflife+'" data-day1="天" data-img="'+$pic+'" title="点击删除" onclick="$foodservice.cancelpublicfood($(this),\''+($name.length>3?$name.substring(0,2)+'..':$name)+'\')"></label>'+
            '     <div class="img" onclick="$foodservice.changefoodlife($(this))"><img src="'+$pic+'"/></div>'+
            '     <p>'+$shelflife+'天</p>'+
            '</li>';
        $('.food-item2 ul').prepend(htmlstr).css('width',($('.food-item2 ul li').length*5)+'rem');
        $('#foodsearch').hide();
        $('#foodinput').show();
    }
}
var accessToken = window.sessionStorage.getItem('accessToken');
var $apiservice = {
    /*
     * 根据冰箱舱室获取冰箱食物
     * paramer $locationid 舱室id
     * */
    getfoodlist:function($locationid,$success,$error){
        var request = {
           "data":{
               url:ENV_HOST_PRE + URLS.GET_FOOD_LIST,
               accessToken:accessToken,
               "deviceId": "ha7744188",
               "location": $locationid
           }
        }
        $ajax.Post(URLS.GET_FOOD_LIST_N,JSON.stringify(request),function(data){
            if($success)
                $success(data);
        },function(msg){
            if(msg == 'token_not_found'){
                $apiservice.getApiAccesstoken();
                location.reload();
                return;
            }else{
                if($error)
                    $error(msg);
                else
                    $sobox.toastMsg(msg);
            }
        })
    },
    /*
     * 批量处理冰箱内食物
     * */
    batchfridgefood:function($param,$action){
        var requset = {
            "data":{
                "url":ENV_HOST_PRE + URLS.BATCH_FRIDGEFOODS,
                "accessToken":accessToken,
                "deviceId": "ha7744188"
            }
        };
        if($action == 'add'){
            requset = {
                "data":{
                    "url":ENV_HOST_PRE + URLS.BATCH_FRIDGEFOODS,
                    "accessToken":accessToken,
                    "deviceId": "ha7744188",
                    "addFridgeFoods": $param
                }
            }
        }
        else if($action == 'del'){
            requset = {
				"data":{
					"url":ENV_HOST_PRE + URLS.BATCH_FRIDGEFOODS,
                	"accessToken":accessToken,
                	"deviceId": "ha7744188",
                	"delFridgeFoods": $param
				}                
            }
        }
        else if($action = 'update'){
            requset = {
                "data":{
					"url":ENV_HOST_PRE + URLS.BATCH_FRIDGEFOODS,
                	"accessToken":accessToken,
                	"deviceId": "ha7744188",
                	"updateFridgeFoods": $param
				}
            }
        }
        $ajax.Post(URLS.BATCH_FRIDGEFOODS_N,JSON.stringify(requset),function(data){
                if($action == 'add'){
                    window.sessionStorage.setItem('isback','1');
                    window.history.go(-1);
                }
                else if($action == 'del')
					location.reload();
        },function(msg){
            $sobox.toastMsg(msg);
        });
    },
    /*
     * 获取冰箱公共食材目录
     * */
    getpubliccatalog:function($success,$error){
        var request = {
            "data":{
                "url":ENV_HOST_PRE + URLS.GET_PUBLICFOOD_CATALOG,
                "accessToken":accessToken
            }
        };
        $ajax.Post(URLS.GET_PUBLICFOOD_CATALOG_N,JSON.stringify(request),function(data){
            if($success)
                $success(data);
        },function(msg){
            if(msg == 'token_not_found'){
                $apiservice.getApiAccesstoken();
                location.reload();
                return;
            }else{
                if($error)
                    $error(msg);
                else
                    $sobox.toastMsg(msg);
            };
        })
    },
    /*
     * 获取冰箱内的公共食材
     * paramer $catalogId 公共食材分类id
     * */
    getpublichfood:function($catalogId,$success,$error){
        var request = {
            "data":{
                "url":ENV_HOST_PRE + URLS.GET_PUBLICFOOD,
                "accessToken":accessToken,
                "catalogId": $catalogId
            }
        };
        $ajax.Post(URLS.GET_PUBLICFOOD_N,JSON.stringify(request),function(data){
            if($success)
                $success(data);
        },function(msg){
            if(msg == 'token_not_found'){
                $apiservice.getApiAccesstoken();
                location.reload();
                return;
            }else{
                if($error)
                    $error(msg);
                else
                    $sobox.toastMsg(msg);
            }
        })
    },
    /*
     * 批量处理用户自定义食材库
     * */
    bactchfridgefoodrepo:function(){
        var requset = {
            "data":{
                "url":ENV_HOST_PRE + URLS.BATCH_FRIDGEFOODS_REPO,
                "accessToken":accessToken,
                "deviceId": "ha7744188",                
            }
        };
        $ajax.Post(URLS.BATCH_FRIDGEFOODS_REPO_N,JSON.stringify(requset),function(data){
            //console.log(data);
        },function(msg){
            $sobox.toastMsg(msg);
        });
    },
    /*
     * 搜索冰箱公共食材
     * paramer $name 食材名称
     * */
    searchpublicfoodByname:function($name,$success,$error){
        var request = {
            "data":{
                "url":ENV_HOST_PRE + URLS.SEARCH_PUBLICFOOD_BYNAME,
                "accessToken":accessToken,
                "name": $name,
                "matchMode":0
            }
        }
        $ajax.Post(URLS.SEARCH_PUBLICFOOD_BYNAME_N,JSON.stringify(request),function(data){
            if($success)
                $success(data);
        },function(msg){
            if($error)
                $error(msg);
            $sobox.toastMsg(msg);
        })
    },
    /*
     * API申请授权，并且获取访问令牌(access_token)
     * */
    getApiAccesstoken:function(){
        var request = {
            "data":{
                "url":URLS.GET_ACCESS,
                "clientId":"unilife_standard_api_haier",
                "clientSecret":"unilife_standard_api_haier_123456"
            }
        }
        $ajax.Post(URLS.GET_ACCESSTOKEN,JSON.stringify(request),function(data){
            window.sessionStorage.setItem('accessToken',data.data.access_token)
        },function(msg){
            $sobox.toastMsg(msg);
        });
    }
}

/**
 * 用户绑定设备 - 注册（短信验证码登录注册）
 * */
var $loginservice = {
    login:function(){
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
        if(!$('#rdoxieyi').is(':checked')){
            $sobox.toastMsg('请先阅读海尔用户使用协议');
            return;
        }
        var $data = {
            "data":{
                "login_name":$('#tel').val(),
                "vercode":$('#code').val()
            }
        };
		var isnew = $('#isnew').val();
		var url = URLS.DO_DYNAMIC_LOGIN;
		// if(isnew == '1'){
		// 	$data = {
		// 		"login_name": $('#tel').val(),
		// 		"vercode": $('#code').val(),
		// 		"registration_id": "",
		// 		"device_token": "",
		// 		"family_id": "",
		// 		"fridge_id": ""
		// 	};
		// 	url = URLS.DO_DYNAMIC_LOGIN;
		// }
        $ajax.Post(url, JSON.stringify($data), function (data) {
            window.sessionStorage.setItem('user',data.data);
			var openid = window.sessionStorage.getItem('openid');
			var request1 = {
				"data":{
					"userId":data.data.user_id,
					"openId":openid	
				}	
			}
			$ajax.Post(URLS.DO_BING_WXUSER,JSON.stringify(request1),function(){
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
    smsCode:function(){
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
            }, function (msg, code,ok) {
                if(code == '5001' || code == '5002'){
					clearInterval(_this.timeInterval);
					if(code == '5001'){
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
                }else{
					clearInterval(_this.timeInterval);
					$('#btnCKcode').removeAttr('disabled').css('color', '#ff792f');
                    $sobox.toastMsg(msg);
                }
            });
        }
    },
	getopenid:function(){
		var code = $url.GetQueryString('code');
        var isgo = $url.GetQueryString('isgo');
        //window.sessionStorage.setItem('openid', 'oWhkvwbmtlOF8CZoXFiDpIQJLmtw');//测试用
		var openid = window.sessionStorage.getItem('openid');
		if(!openid){
			
			if(code){
				$.get(URLS.GET_OPENID+'?code='+code,function(data){
                    //$('body').append(JSON.stringify(data.data));
					//window.sessionStorage.setItem('openid','112');
					if(data.code == '200'){
						window.sessionStorage.setItem('openid',JSON.stringify(data.data.openid));
						//$sobox.toastMsg(data.data.openid);
						var request = {
							"data":{
								"openId":data.data.openid
							}
						};
						$ajax.Post(URLS.GET_WXUSER_BYOPENID,JSON.stringify(request),function(data){
                            window.sessionStorage.setItem('user', JSON.stringify(data.data));
							$('#indexhref').attr('href','devicechoose.html?phoneNumber='+data.data.phone+'#');
							if(isgo != 1)
                                location.replace('index.html?phoneNumber='+data.data.phone+'#&isgo=1');
						},function(msg,code){
							$('#indexhref').attr('href','binddevice.html');
						});
					}else{
						$sobox.toastMsg(data.message);	
					}
				 });
			}
				
		}else{
			var request = {
				"data":{
					"openId":openid				
				}
			};
			$ajax.Post(URLS.GET_WXUSER_BYOPENID,JSON.stringify(request),function(data){
			    window.sessionStorage.setItem('user', JSON.stringify(data.data));
				$('#indexhref').attr('href','devicechoose.html?phoneNumber='+data.data.phone+'#');
                if(isgo != 1)
				    location.replace('index.html?phoneNumber='+data.data.phone+'#&isgo=1');
			},function(msg,code){
				$('#indexhref').attr('href','binddevice.html');
			});				
		}
	}
}


function picUrl($imgsrc){
    var imgName = $imgsrc.substring($imgsrc.lastIndexOf('/'),$imgsrc.lastIndexOf('.'));
    var imgCatalog = $imgsrc.substring($imgsrc.lastIndexOf('.'));

    return 'http://fridge.unilifemedia.com:8100/pic/publicFood'+imgName+imgCatalog;
}