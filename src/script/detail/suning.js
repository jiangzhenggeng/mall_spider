
/**
 * Created by jiangzg on 2017/7/28.
 * 支持 https://ju.suning.com/pc/jusp/product-4f210709541cf5ca.html#?src=djh_none_recdjhznpx_1-2_p_0000000000_617641800_01A_0_0_A
 * 和 http://product.suning.com/0000000000/140444171.html
 * 两种地址
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
		var title = trim(My$('#partNameId').text()||My$('#itemDisplayName').text() );
		var price = '',
			mark_price = '';

		if(My$('#priceDom').length){
			price = priceFn(My$('#priceDom .mainprice').text() );
			mark_price = priceFn(My$('#priceDom del.small-price').text() );
		}else if(My$('#commPriceId').length){
			price = priceFn(My$('#commPriceId .sale-price').text() );
			mark_price = priceFn(My$('#commPriceId .original-price').text() );
		}

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		var detail = '';
		if(My$('#bannerImgUrlId').length){
			My$('#bannerImgUrlId').find('li img').each(function () {
				var p = My$(this).attr('src');
				if(p.substr(0,2)=='//'){
					p = 'http:'+p;
				}
				pic.push(p);
			});
			My$('#J_prodesc table').remove();
			detail = (My$('#J_prodesc').html()||'').replace(/^\s+|\s+$/g,'');
		}else{
			My$('.imgzoom-thumb-main').find('li img').each(function () {
				var p = My$(this).attr('src-large') || My$(this).attr('src');
				if(p.substr(0,2)=='//'){
					p = 'http:'+p;
				}
				pic.push(p);
			});
			var descBox = My$('#productDetail').find('[moduleid=R1901001_3][modulename]');
			descBox.find('img').removeAttr('onload').removeAttr('class').removeAttr('height').removeAttr('width');
			detail = (descBox.html()||'').replace(/^\s+|\s+$/g,'');
		}

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
