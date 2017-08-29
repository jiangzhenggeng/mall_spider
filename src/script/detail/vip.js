
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
        var title = trim( My$('.pib-title .pib-title-detail').text());

        var price = priceFn( My$('#J-pi-price-box .J-price').text() );
        var mark_price = priceFn( My$('#J-pi-price-box .J-mPrice').text() );

        var discount = '';
        if(price && mark_price){
            discount = (price/mark_price * 10).toFixed(1);
            if(discount<=0 || discount>=10 )discount = '';
        }
        var pic = [];
        My$('#J-sImg-wrap').find('img').each(function () {
            var p = My$(this).attr('src');
            if(p.substr(0,2)=='//'){
                p = 'http:'+p;
            }
            p = p.replace(/_\d+x\d+_\d+\.jpg/i,'.jpg');
            pic.push(p);
        });

        My$('.dc-img img[data-original]').each(function () {
            My$(this).attr('src',My$(this).attr('data-original'));
            My$(this).removeAttr('data-original');
        });
        var detail = (My$('.dc-img').html()||'').replace(/^\s+|\s+$/g,'');
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
    this.echo(JSON.stringify(data,null,2));

});

casper.run(function(){
    this.exit();
});

