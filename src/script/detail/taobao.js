
/**
 * Created by jiangzg on 2017/7/28.
 */

var tool = require('./libs/tool');
var casper = require('./libs/boot')(require('casper'),{
	viewportSize: {
		width: 1600
	},
	onResourceRequested:function (resource, request) {

	}
});

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
			return String(string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
		}
		var title = trim(My$('#J_Title h3.tb-main-title').first().text());
		var price = My$('#J_PromoPriceNum').text().replace(/[^\d\.]/g,'');
		var mark_price = My$('#J_StrPriceModBox .tb-rmb-num').first().text().replace(/[^\d\.]/g,'');

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		My$('#J_UlThumb li img').each(function () {
			var p = My$(this).attr('src');
			if(p.substr(0,2)=='//'){
				p = 'http:'+p;
			}
			p = p.replace(/\.jpg_\d+x\d+(q\d+|)\.jpg/ig,'.jpg');
			pic.push(p);
		});

		var o = My$('#description > .content').first(),
			o_img = o.find('img[data-ks-lazyload]');
		o_img.attr('src',o_img.attr('data-ks-lazyload') );
		var detail = (o.html()||'').replace(/^\s+|\s+$/g,'');
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
	data.logo = 'bd133e67-9ae5-47c6-b009-880e42c74ebe';
	data.mall_type = 'taobao';
	this.echo(JSON.stringify(data));
	this.exit();

});

casper.run(function(){
	this.exit();
});
