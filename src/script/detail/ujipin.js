
/**
 * Created by jiangzg on 2017/7/28.
 */

var tool = require('./libs/tool');
var casper = require('./libs/boot')(require('casper'));

var waitTimer = require('./libs/waitTime');
var data = {};

casper.then(function() {
    waitTimer.call(this,false);
}).then(function() {

    data = this.evaluate(function () {

        function trim(string) {
            return (string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
        }
        function priceFn(string) {
            return (string||'').split('-')[0].replace(/[^\d\.]/g,'');
        }
        var discount = '',detail = '',price = '',mark_price = '';
        var _input_val_ = My$('#goods_data-input').val();
        if( _input_val_ ){
            var _input_val_json_ = JSON.parse(_input_val_);

            price = _input_val_json_.goods_price || '';
            mark_price = _input_val_json_.market_price || '';
            if(price && mark_price){
                discount = (price/mark_price * 10).toFixed(1);
                if(discount<=0 || discount>=10 )discount = '';
            }
            var _detail_ = _input_val_json_.story.slices;
            My$.each(_detail_,function (index,item) {
                detail += '<p>'+item.content + '</p>' + '<p><img src="'+item.image+'" /></p>';
            });
            return {
                brand:_input_val_json_.brand.name,
                title:_input_val_json_.goods_name,
                price:price,
                mark_price:mark_price,
                url:window.location.href,
                pic:_input_val_json_.splash,
                cover:_input_val_json_.splash[0],
                detail:detail,
                discount:discount
            };
        }else{
            var title = trim( My$('.good-right .title').text());

            price = priceFn( My$('#goods_price').text() );
            mark_price = priceFn( My$('.market_value').parent().text() );

            if(price && mark_price){
                discount = (price/mark_price * 10).toFixed(1);
                if(discount<=0 || discount>=10 )discount = '';
            }
            var pic = [];
            My$('#thumblist').find('li img').each(function () {
                var p = My$(this).attr('src');
                if(p.substr(0,2)=='//'){
                    p = 'http:'+p;
                }
                pic.push(p);
            });

            detail = (My$('.detial_show').html()||'').replace(/^\s+|\s+$/g,'');
            if ( !detail ) {
                pic.forEach(function (item) {
                    detail += '<img src="'+item+'" />';
                });
            }
        }

        return {
            title:title,
            price:price ,
            mark_price:mark_price ,
            pic:pic,
            cover:pic[0],
            detail:detail,
            discount:discount
        };
    });
    data.url   = this.getCurrentUrl();
    this.echo(JSON.stringify(data));

});

casper.run(function(){
    this.exit();
});

