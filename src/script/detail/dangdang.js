
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
		var title = trim(My$('.name_info > h1').first().text() || My$('.head[name="Title_pub"] > h1').first().text());

		var price = priceFn(My$('#dd-price').text()) || priceFn(My$('#d_price').text());
		var mark_price = priceFn(My$('#original-price').text()) || priceFn(My$('#d_price').next('span').text() ||  priceFn(My$('.pricestock_pub p>i.m_price').text()) );

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		My$('#mainimg_pic,#main-img-slider').find('li img').each(function () {
			var p = My$(this).attr('src');
			if(p.substr(0,2)=='//'){
				p = 'http:'+p;
			}
			p = p.replace(/([\d+])\-([\d])\_[a-z]\_([\d])\.jpg$/ig,'$1-$2_u_$3.jpg');
			pic.push(p);
		});

		var detail = (My$('#abstract_all').html()||'').replace(/^\s+|\s+$/g,'');
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
	this.exit();

});

casper.run(function(){
	this.exit();
});
