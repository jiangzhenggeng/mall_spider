
/**
 * Created by jiangzg on 2017/7/28.
 */

var tool = require('./libs/tool');
var casper = require('./libs/boot')(require('casper'),{
    waitTimeout:12000
});

var waitTimer = require('./libs/waitTime');
var data = {};

casper.then(function() {
    waitTimer.call(this,false,1200,1500);
}).waitForSelector('.intro .name').then(function() {

    data = this.evaluate(function () {

        function trim(string) {
            return (string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
        }
        function priceFn(string) {
            return (string||'').split('-')[0].replace(/[^\d\.]/g,'');
        }
        var title = trim(My$('.intro').first().find('.name').text() );

        var price = priceFn(My$('.price .pBox .rp .num').text() );
        var mark_price = priceFn( My$('.price .pBox .op s').eq(0).text() );

        var discount = '';
        if(price && mark_price){
            discount = (price/mark_price * 10).toFixed(1);
            if(discount<=0 || discount>=10 )discount = '';
        }
        var pic = [];
        My$('.m-slide .list').find('li img').each(function () {
            var p = My$(this).attr('src');
            if(p.substr(0,2)=='//'){
                p = 'http:'+p;
            }
            p = p.split('&thumbnail')[0];
            pic.push(p);
        });
        var descObj = My$('.m-detailHtml');
        descObj.find('ul.m-attrList').remove();
        descObj.find('img[data-original]').each(function () {
            var src = My$(this).attr('data-original');
            if(src.substr(0,2)=='//') src = 'http:'+src;
            My$(this).attr('src',src);
        });
        var detail = (descObj.html()||'').replace(/^\s+|\s+$/g,'');
        if ( !detail ) {
            pic.forEach(function (item) {
                detail += '<img src="'+item+'" />';
            });
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
    data.url   = this.url;
    this.echo(JSON.stringify(data));

});

casper.run(function(){
    this.exit();
});
