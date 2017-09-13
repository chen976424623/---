/**
 * Created by zq on 2016/8/10.
 * request helper
 */
'use strict';
/*ajax*/
/*封装请求参数*/
function createHeader($data,$userid) {
    var app_key = "412f2f216d620d83976d41d9ae3dba1f";
    var token = '';
    var header = {
        "app": {
            "app_id": "MB-FRIDGEGENE1-0000",
            "version": "BXN_401_0080_0000",
            "api_version": 160815,
            "user_id": $userid?$userid:""
        },
        "device": {
            "platform": "XiaoMi Note2",
            "model": "Android 4.4.2",
            "factory": "XiaoMi",
            "screen_size": "1920*1080",
            "denstiy": 2,
            "imei": "352105068965016/01",
            "mac": "50-8D-4F-4S-55-5D",
            "gprs": "4G",
            "latitude": 39.972907,
            "longitude": 116.503154
        },
        "token_check": {
            "access_token": token,
            "timestamp": Date.parse(new Date()),
            "sign": function () {
                var str = $data;
                str += header.app.app_id + app_key + this.timestamp
                return str;
                 },
            "client_id": "356877020056553-08002700DC94",
            "sequence_id": "08002700DC94-15110519074300001",
            "language": "zh-cn",
            "timezone": "8"
        },

    };
    var headerStr = header.token_check.sign();
    headerStr = headerStr.replace("{", "").replace("}", "").replace(/""/g, "").replace(/"\t"/g, "").replace(/"\r"/g, "").replace(/"\n"/g, "");
    var md5Str = hex_md5(headerStr);
    header.token_check.sign = md5Str;
    return header;
}
function createRequestData($data,$userid) {
    var requestData = {
        verify_info: createHeader($data,$userid),
        data: $data,
    }
    return requestData;
}

var $ajax = {
    Post: function ($url, $data, $success, $error, $opt) {
        $data = ($data) ? $data : "";
        if (!$success) {
            throw new Error("Success call back can't be null");
        }
        $error = ($error) ? $error : function ($err, $state) {
            /*console.info("error: " + $err);*/
        };
        $opt = $opt || {};
        if ($opt.showMask) {
            $opt.maskText = $opt.maskText || "数据载入中";
            $sobox.showMask($opt.maskText);
        }

        // console.info($url);
        // console.info($data);

        $.ajax({
            type: "POST",
            url: $url,
            data: $data,
            dataType: 'json',
            contentType: "application/json",
            async: false,
            timeout: 5000,
            success: function ($ret) {
                $sobox.hideMask();
                if ($ret.code == "200" || $ret.errorno == '0') {
                    $success($ret);
                }
                else {
                    $error($ret.message?$ret.message:$ret.errormsg, $ret.code?$ret.code:$ret.errorno,$ret.ok);
                    $sobox.hideMask();
                }
            },
            error: function ($xmlHttpRequest, $txtStatus, $errorThrown) {
                $error("网络异常", $txtStatus);
                $sobox.hideMask();
            }
        });
    },
    basePost: function ($url, $data, $success, $error, $opt) {
        $data = ($data) ? $data : "";
        if (!$success) {
            throw new Error("Success call back can't be null");
        }
        $error = ($error) ? $error : function ($err, $state) {
            /*console.info("error: " + $err);*/
        };
        $opt = $opt || {};
        if ($opt.showMask) {
            $opt.maskText = $opt.maskText || "数据载入中";
            $sobox.showMask($opt.maskText);
        }

        // console.info($url);
        // console.info($data);

        $.ajax({
            type: "POST",
            url: $url,
            data: $data,
            dataType: 'json',
            contentType: "application/json",
            async: true,
            timeout: 5000,
            success: function ($ret) {
                $sobox.hideMask();
                $success($ret);
            },
            error: function ($xmlHttpRequest, $txtStatus, $errorThrown) {
                $error("网络异常", $txtStatus);
                $sobox.hideMask();
            }
        });
    }
}
/*接口url*/
var ENV_HOST = "http://apilinkcook.onehaier.com/";
var ENV_HOST_PRE = "http://fridge.unilifemedia.com:8100/service/v1/";

//var ENV_HOST = "http://api.haieco.com:8080/linkcookapi/";
var ENV_HOST_BJ = 'https://iot.onehaier.com/v2/food/';/*北京食材管理*/
var accesstoken = 'c1a07a19b983dd3425909940a82d2105';
var token = JSON.parse(window.sessionStorage.getItem('accesstoken'));
if(token){
    accesstoken = token.access_token;
}
var URLS = {
    DO_REGISTER:ENV_HOST + 'user/user.register.check',/*用户注册*/
    DO_LOGINREGISTER_CKCODE: ENV_HOST + 'user/user.register.vercode.get', /*获取登陆、注册验证码 类型,login:登录 register：注册*/
    DO_LOGIN_CKCODE: ENV_HOST + 'BJInterface/userCenter/getLoginVercode', /*获取登陆验证码 */
    DO_DYNAMIC_LOGIN: ENV_HOST + 'BJInterface/userCenter/vercodeLogin', /*手机号验证码登录*/

    DO_QUICKLOGIN_VERCODE:ENV_HOST + 'user/user.quick.login.vercode',/*快速登录验证码*/
    DO_QUICKLOGIN:ENV_HOST + 'user/user.quick.login',/*快速登录*/
	
	GET_OPENID:ENV_HOST + 'fridge/food/getWXOpenid',/*获取openid*/
	DO_BING_WXUSER:ENV_HOST + 'fridge/food/bindWxUser',/*绑定微信用户*/
	GET_WXUSER_BYOPENID:ENV_HOST + 'fridge/food/getWxUserByOpenId',/*根据openid查询用户*/

    GET_ACCESSTOKEN:ENV_HOST + 'fridge/food/access',/*获取API授权*/
    GET_FOOD_LIST_N:ENV_HOST + 'fridge/food/getList',/**/
    BATCH_FRIDGEFOODS_N:ENV_HOST + 'fridge/food/batchFridgeFoods',/*批量处理冰箱食物*/
    GET_PUBLICFOOD_CATALOG_N:ENV_HOST + 'fridge/food/getPublicFoodCatalog', /*获取冰箱内的公共食材目录*/
    GET_PUBLICFOOD_N:ENV_HOST + 'fridge/food/getPublicFood', /*获取冰箱内的公共食材*/
    SEARCH_PUBLICFOOD_BYNAME_N:ENV_HOST +  'fridge/food/searchPublicFoodByName', /*搜索冰箱内的公共食材*/
    BATCH_FRIDGEFOODS_REPO_N:ENV_HOST +  'fridge/food/batchFridgeFoodsRepo',/*批量处理用户冰箱自定义食材库中食物*/

    GET_ACCESS: 'http://fridge.unilifemedia.com:8100/service/access?&grant_type=client_credentials', /*获取访问令牌*/
    GET_PUBLICFOOD_CATALOG: 'food/getPublicFoodCatalog', /*获取冰箱内的公共食材目录*/
    GET_PUBLICFOOD: 'food/getPublicFood', /*获取冰箱内的公共食材*/
    SEARCH_PUBLICFOOD_BYNAME: 'food/searchPublicFoodByName', /*搜索冰箱内的公共食材*/

    GET_FOOD_LIST: 'food/getList',/*获取冰箱食物列表*/
    GET_FOOD_DETAIL: 'food/getDetail',/*获取冰箱内食物详情*/
    DO_ADD_FOOD: 'food/add',/*向冰箱中添加食物信息*/
    DO_EAT_FOOD: 'food/eat',/*吃掉冰箱食物*/
    DO_THROW_FOOD: 'food/throw',/*扔掉冰箱里面的食物*/
    BATCH_FRIDGEFOODS: 'food/batchFridgeFoods',/*批量处理冰箱食物*/
    BATCH_FRIDGEFOODS_REPO: 'food/batchFridgeFoodsRepo',/*批量处理用户冰箱自定义食材库中食物*/

    /*北京食材管理接口*/
    GET_FOOD_LIST_BJ:ENV_HOST_BJ + 'food.fridge.get',/*冰箱内食材列表获取*/
    DO_FOOD_DELETE_BJ:ENV_HOST_BJ + 'food.todel.batch.delete',/*冰箱内食材删除*/
    DO_FOOD_ADD_BJ:ENV_HOST_BJ + 'food.toadd.batch.add',/*冰箱内食材添加*/

    SEARCH_FOOD_CATALOG_BJ:ENV_HOST_BJ + 'food.category.query',/*食材库类目搜索食材*/
    SEARCH_FOOD_NAME_BJ:ENV_HOST_BJ + 'food.name.query',/*食材库名称搜索食材*/
    GET_FOOD_CATALOG_BJ:ENV_HOST_BJ + 'food.category.list.get',/*食材库食材类别列表*/
    GET_FOOD_DETAIL_BJ:ENV_HOST_BJ + 'food.detail.get',/*食材库食材详情信息*/

}
/*url处理*/
var $url = {
    GetQueryString:function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

}
/*验证*/
var Valid = {
    /**
     * 验证手机号码
     * @param $mobile
     * @returns true success false fail
     */
    checkMobile : function($mobile){
        //var reg = /^1\d{10}$/;
        var reg = /^1[3|4|5|7|8]\d{9}$/;
        return ($mobile && $mobile.match(reg));
    },

    /**
     * 验证密码
     * @param $Password
     * @returns true success false fail
     */
    checkPassword : function($Password){
        var reg = /^[^\s]{6,16}$/;
        return ($Password && $Password.match(reg));
    },

    /**
     * 验证验证码
     * @param $mobile
     * @returns true success false fail
     */
    checkValidCode : function($code){
        var reg = /^\d{6}$/;
        return ($code && $code.match(reg));
    },

    /**
     * 验证非空
     * @param $context
     */
    checkRequired: function ($context) {
        if ($context == null || $context == undefined || $context == NaN || $context.length == 0){
            return false;
        }
        return true;
    },

    checkImage:function($image){
        var regexp=new RegExp("(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$",'g');
        return regexp.test($image);
    },

    /*------------------------
     功能：检测是否是有效日期
     -------------------------*/
    checkDate:function ($date){
        var reg = /^([1-2]\d{3})[\/|\-]?(0?[1-9]|10|11|12)[\/|\-]?([1-2]?[0-9]|0[1-9]|30|31)$/;
        return ($date && $date.match(reg));
    },

    /**
     *验证身份证号
     * @param $idNo
     * @returns ture success fase fail
     * */
    checkIndentity:function($idNo){
        var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        //var reg =/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i ;
        if (!reg.test($idNo)) {
            return false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if($idNo.length == 18){
                $idNo = $idNo.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = $idNo[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != $idNo[17]){
                    return false;
                }
            }
            return true;
        }
        return true;
    }
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
//毫秒日期格式转化
function renderTime(date,fmt){
    var d = new Date()
    d.setTime(date)
    return d.Format(fmt);
}
////////////////////////////////////////////////////////////////////////////////////////////
//计算两个日期天数差的函数，通用
////////////////////////////////////////////////////////////////////////////////////////////
function DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式
	//console.log(sDate1 + ' ' + sDate2);
    var aDate,bDate, oDate1, oDate2, iDays;
    aDate = sDate1.split(/[- : \/]/);
    oDate1 = Date.parse(new Date(aDate[0], aDate[1]-1, aDate[2]));  //转换为yyyy-MM-dd格式
    bDate = sDate2.split(/[- : \/]/);
    oDate2 = Date.parse(new Date(bDate[0], bDate[1]-1, bDate[2]));
	//console.log(aDate + ' ' + bDate + oDate1 + ' ' + oDate2);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数

    return iDays;  //返回相差天数
}

////////////////////////////////////////////////////////////////////////////////////////////
//根据指定的一个日期和相差的天数，获取另外一个日期
//dateParameter为指定已经存在的日期yyyy-MM-dd  num为相差天数为整型
////////////////////////////////////////////////////////////////////////////////////////////
function addByTransDate(dateParameter, num) {

    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/"); ;

    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate + num * 24 * 60 * 60 * 1000;  //备注 如果是往前计算日期则为减号 否则为加号
    newDate = new Date(newDate);

    //如果月份长度少于2，则前加 0 补位
    if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
        monthString = (newDate.getMonth() + 1).toString();
    }

    //如果天数长度少于2，则前加 0 补位
    if (newDate.getDate().toString().length == 1) {

        dayString = 0 + "" + newDate.getDate().toString();
    } else {

        dayString = newDate.getDate().toString();
    }

    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;

}
	/*iscroll*/
	// ref https://github.com/WICG/EventListenerOptions/pull/30
	function isPassive() {
		var supportsPassiveOption = false;
		try {
			addEventListener("test", null, Object.defineProperty({}, 'passive', {
				get: function () {
					supportsPassiveOption = true;
				}
			}));
		} catch(e) {}
		return supportsPassiveOption;
	}