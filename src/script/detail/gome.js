
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
		var title = trim(My$('.hgroup > h1').first().text() || My$('.grdsd-tit').first().text());

		var price = '';
		if(My$('#salePrice').text()){
			price = priceFn( My$('#salePrice').text() );
		}else if(My$('#tuan_prom').css('display')!='none' ){
			price = priceFn( My$('#tuan_prom .h1_red_price').text() );
		}else if( My$('#prdPrice').text() ){
			price = priceFn( My$('#prdPrice').text() );
		}

		var mark_price = priceFn(My$('#prdPrice').text() );

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		My$('.pic-small').find('li img').each(function () {
			var p = My$(this).attr('rpic') || My$(this).attr('bpic') || My$(this).attr('src');
			if(p.substr(0,2)=='//'){
				p = 'http:'+p;
			}
			pic.push(p);
		});

		var descObj = My$('#productDesc');
		descObj.find('img[gome-src]').each(function () {
			My$(this).attr('src',My$(this).attr('gome-src') );
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
			mark_price:mark_price,
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
