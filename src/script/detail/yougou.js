
/**
 * Created by jiangzg on 2017/7/28.
 */

var tool = require('./libs/tool');
var casper = require('./libs/boot')(require('casper'));

var waitTimer = require('./libs/waitTime');
var data = {};

casper.then(function() {
    waitTimer.call(this,false);
    this.evaluate(function () {
        My$(window).scrollTop(1800);
    });
}).then(function() {

    data = this.evaluate(function () {

        function trim(string) {
            return (string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
        }
        function priceFn(string) {
            return (string||'').split('-')[0].replace(/[^\d\.]/g,'');
        }
        var title = trim(My$('.goodsCon').first().find('h1').text() );

        var price = priceFn(My$('#yitianPrice').text() );
        var mark_price = priceFn(My$('#ygprice_area del').eq(0).text() );

        var discount = '';
        if(price && mark_price){
            discount = (price/mark_price * 10).toFixed(1);
            if(discount<=0 || discount>=10 )discount = '';
        }
        var pic = [];
        My$('#spec-list').find('li img').each(function () {
            var p = My$(this).attr('piclargeurl') || My$(this).attr('picbigurl') || My$(this).attr('src');
            if(p.substr(0,2)=='//'){
                p = 'http:'+p;
            }
            p = p.replace(/(\d+_\d+_)[a-z]\.jpg/,'$1l.jpg');
            pic.push(p);
        });

        var detail = (My$('#contentDetail').html()||'').replace(/^\s+|\s+$/g,'');
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
    data.url   = this.getCurrentUrl();
    this.echo(JSON.stringify(data));
    this.exit();

});

casper.run(function(){
    this.exit();
});
