/**
 * Created by jiangzg on 2017/8/7.
 */



(function () {
    var $ = My$;

    var loadHuihui = function (box,url,timesLong) {
        //加载慧慧的价格数据
        var t = '1502792232600';
        var callbackName = 'youdaogouwupi'+t;
        //注册回调函数
        window[callbackName] = function (json) {
            box.data('huihui-json',json);
            box.attr('data-huihui-json','ok').find('.my-spider-loading-huihui-data').remove();
        };
        box.append('<span class="my-spider-loading-huihui-data">加载中...</span>');
        $.ajax({
            url: "https://zhushou.huihui.cn/productSense",
            type: 'GET',
            data: {
                jsonp:callbackName,
                phu:url,
                type:'canvas',
                t:t
            },
            cache: false,
            dataType: 'html',
            success: function (replatData) {
                eval(replatData);
            },
            error:function () {
                box.find('.my-spider-loading-huihui-data').remove();
                box.removeAttr('data-huihui-json');
            }
        });
    };

    $('body').on('mouseenter','a[href]',function () {
        if( $(this).data('already-wrap-box') ){
            $(this).data('already-wrap-box').find('.my-spider-link-next').show();
            return;
        }

        var url = $(this).attr('href');
        url = url.substr(0,2)=='//'?'http:'+url:url;

        if( $(this).data('already-mark') || !url ) return;
        var result = $.parseUrl(url);
        if(!result.host) return;
        var _this = $(this), box = null;

        URL_CONFIG.forEach(function(item, index){
            if(item.host.toLocaleLowerCase()==result.host.toLocaleLowerCase()){
                box = item.hasInsertDom(_this);
                _this.data('already-wrap-box',box);

                if( box ){

                    if( box.attr('data-huihui-json')!='ok'){
                        loadHuihui(box,url,1);
                    }
                    var pos = box.css('position');
                    if(pos!='fixed' && pos!='relative' && pos!='absolute'){
                        box.css('position','relative');
                    }
                    box.addClass('my-spider-link-wrap');
                    box.append('<span class="my-spider-link-next">采集</span>');
                    _this.data('already-mark','ok');
                    var _span = box.find('.my-spider-link-next');
                    _span.data('already-item',item);
                    _span.data('already-wrap-box',box);
                    return false;
                }
            }
        });
    }).on('click','.my-spider-link-next',function () {
        var _this = $(this);
        if( _this.hasClass('my-spider-link-already') ) return;
        var config_item = _this.data('already-item');
        var item_data = config_item.getItemData( _this.data('already-wrap-box') );

        if( item_data.url && item_data.url.substr(0,2)=='//' ){
            item_data.url = 'http:'+item_data.url;
        }

        var box = _this.data('already-wrap-box');
        var huihui_json = box.data('huihui-json') || {};
        
        if(!item_data.price) item_data.price = huihui_json.today || huihui_json.min;
        if(!item_data.mark_price) item_data.mark_price = huihui_json.max;

        item_data.price = $.priceFn(item_data.price);
        item_data.mark_price = $.priceFn(item_data.mark_price);

        item_data.mall = config_item.mall;
        item_data.shop = config_item.shop;
        if(item_data.price && item_data.mark_price && item_data.price!=item_data.mark_price && item_data.price<item_data.mark_price){
            item_data.discount = Number( item_data.price / item_data.mark_price * 10 ).toFixed(1);
        }

        item_data.pic = item_data.pic.map(function (item) {
            return $.extendUrl(item);
        });

        chrome.runtime.sendMessage({
            type:'get-item-html',
            data:item_data
        }, function(response){
            if(response.result=='ok'){
                _this.addClass('my-spider-link-success').html('已采集');
            }else{
                _this.addClass('my-spider-link-error').html('采集失败');
            }
        });
    });

})();










