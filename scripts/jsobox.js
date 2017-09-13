/**
 * Created by flyzq0525 on 2016-08-15.
 */
'use strict';
var $sobox = {
    confirm: function (t, okcallback, cancelcallback) {
        var ht = '<div class="weui_dialog_confirm" >'
            + '<div class="weui_mask"></div>'
            + '<div class="weui_dialog">'
            + '<div class="weui_dialog_hd"><strong class="weui_dialog_title">'+t+'</strong></div>'
            + '<div class="weui_dialog_ft">'
            + '<a href="javascript:;" class="weui_btn_dialog default cancel">取消</a><a href="javascript:;" class="weui_btn_dialog primary ok">确定</a></div>'
            + '</div></div>';
        $("body").append(ht);
        var _obj = $('.weui_dialog_confirm');
        _obj.find('.cancel').on('click', function () {
            $sobox.hide($(_obj), cancelcallback);
        })
        _obj.find('.ok').on('click', function () {
            $sobox.hide($(_obj), okcallback);
        })
    },
    alert: function (t, okcallback, cancelcallback) {
        var ht = '<div class="weui_dialog_alert" >'
            + '<div class="weui_mask"></div>'
            + '<div class="weui_dialog">'
            + '<div class="weui_dialog_hd"><strong class="weui_dialog_title"></strong></div>'
            + '<div class="weui_dialog_bd">' + t + '</div>'
            + '<div class="weui_dialog_ft">'
            + '<a href="javascript:;" class="weui_btn_dialog primary ok">确定</a></div>'
            + '</div></div>';
        $("body").append(ht);
        var _obj = $('.weui_dialog_alert');
        _obj.find('.ok').on('click', function () {
            $sobox.hide($(_obj), okcallback);
        })
    },
    alertTwo: function (t,b, okcallback, cancelcallback) {
        var ht = '<div class="weui_dialog_alert" >'
            + '<div class="weui_mask"></div>'
            + '<div class="weui_dialog">'
            + '<div class="weui_dialog_hd"><strong class="weui_dialog_title">'+t+'</strong></div>'
            + '<div class="weui_dialog_bd">' + b + '</div>'
            + '<div class="weui_dialog_ft">'
            + '<a href="javascript:;" class="weui_btn_dialog primary ok">确定</a></div>'
            + '</div></div>';
        $("body").append(ht);
        var _obj = $('.weui_dialog_alert');
        _obj.find('.ok').on('click', function () {
            $sobox.hide($(_obj), okcallback);
        })
    },
    toast: function () {
        var ht = '<div id="toast"><div class="weui_mask_transparent"></div><div class="weui_toast"><i class="weui_icon_toast"></i><p class="weui_toast_content">已完成</p></div></div>';
        $("body").append(ht);
        setTimeout(function () {
            $('#toast').remove();
        }, 2000);
    },
    toastMsg: function (t) {
        var ht = '<div id="toastMsg"><div class="weui_mask_transparent"></div><div class="weui_toast weui_toast_msg"><p class="weui_toast_content">'+t+'</p></div></div>';
        $("body").append(ht);
        setTimeout(function () {
            $('#toastMsg').remove();
        }, 2000);
    },
    loading: function () {
        var ht = '<div id="loadingToast" class="weui_loading_toast">'
            + '<div class="weui_mask_transparent"></div>'
            + '<div class="weui_toast">'
            + '<div class="weui_loading">'
            + '<div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div>'
            + '</div>'
            + '<p class="weui_toast_content">数据加载中</p>'
            + '</div>'
            + '</div>';
        $("body").append(ht);
        setTimeout(function () {
            $('#loadingToast').hide();
        }, 2000);
    },
    showMask: function (t) {
        var ht = '<div id="loadingToast" class="weui_loading_toast">'
            + '<div class="weui_mask_transparent"></div>'
            + '<div class="weui_toast">'
            + '<div class="weui_loading">'
            + '<div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div>'
            + '</div>'
            + '<p class="weui_toast_content">'+t+'</p>'
            + '</div>'
            + '</div>';
        $("body").append(ht);
        //setTimeout(function () {
        //    $('#loadingToast').hide();
        //}, 2000);
    },
    hideMask: function () {
        $('#loadingToast').remove();
    },
    hide: function ($this, callback) {
        $this.remove();
        if (callback)
            callback();
    }
}