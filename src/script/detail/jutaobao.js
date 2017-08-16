
/**
 * Created by jiangzg on 2017/7/28.
 */

var tool = require('./libs/tool');
var casper = require('./libs/boot')(require('casper'),{
	viewportSize: {
		width: 3200
	},
});
var waitTimer = require('./libs/waitTime');
var data = {};


casper.then(function() {
	waitTimer.call(this,false);
}).then(function () {

	data = this.evaluate(function () {

		function trim(string) {
			return (string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
		}
		function priceFn(string) {
			return (string||'').split('-')[0].replace(/[^\d\.]/g,'');
		}

		var title = trim(My$('.J_mainBox .title').first().text());
		var price = priceFn(My$('.J_statusBanner .J_actPrice').first().text());
		var mark_price = priceFn(My$('.J_statusBanner .originPrice').text());

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		var p = '';
		My$('.thumbnails li img').each(function () {
			p = (My$(this).attr('data-big') || My$(this).attr('src')||'').replace(/_\d+[a-z]\d+[a-z]+\d+\.jpg_\.webp$/i,'');
			if(p.substr(0,2)=='//'){
				p = 'http:'+p;
			}
			pic.push(p);
		});

		var detail = (My$('.infodetail').html()||'').replace(/^\s+|\s+$/g,'');
		if ( !detail ) {
			pic.forEach(function (item) {
				detail += '<img src="'+item+'" />';
			});
		}
		var url = (My$('.J_mainBox [data-miaoshaurl]').attr('data-miaoshaurl')||'').replace(/&root_refer=.*/gi,'');
		if(url.substr(0,2)=='//'){
			url = 'http:'+url;
		}
		return {
			title:title,
			price:price,
			mark_price:mark_price,
			pic:pic,
			cover:pic[0],
			detail:detail,
			discount:discount,
			url:url
		};
	});

	data.starturl   = this.url;
	this.echo(JSON.stringify(data));
	this.exit();
});


casper.run(function(){
    this.exit();
});




