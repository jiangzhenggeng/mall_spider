
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
		var title = trim( My$('.unit_tit h1').text()||My$('#productMainName').text() );

		var price = priceFn( My$('#pricenow').text()||My$('#current_price').text() );
		var mark_price = priceFn( My$('#marketPrice').text()||My$('#current_price_del').text() );

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		My$('#jsproCrumb .mBox').eq(0).find('img').each(function () {
			var p = My$(this).attr('src');
			if(p.substr(0,2)=='//'){
				p = 'http:'+p;
			}
			pic.push(p);
		});

		var detail = My$('.desbox').html();
		if ( !detail ) {
			pic.forEach(function (item) {
				detail += '<img src="'+item+'" />';
			});
		}

		return {
			title:title,
			price:price,
			mark_price:mark_price,
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
