
/**
 * Created by jiangzg on 2017/7/28.
 */

var _casper_ = require('casper').create();
var id = (_casper_.cli.get(0)||'').match(/(\?|&)id=(\d+)/i)[2];

var urlPc = 'http://hws.m.taobao.com/cache/wdetail/5.0/?id=' + id;

var tool = require('./libs/tool');
var casper = require('./libs/boot')(require('casper'),{
	viewportSize: {
		width: 1600,
		height: 900,
	},
	url:urlPc,
});
var waitTimer = require('./libs/waitTime');
var data = {};

casper.then(function() {
	waitTimer.call(this,false);
}).then(function () {
	var content = (this.getPageContent()||'');
	if(content.substr(0,1)!='{' && content.substr(0,1)!='['){
		return;
	}
	content = JSON.parse(content);
	var _data_ = content.data;
	data = {
		title:_data_.itemInfoModel.title,
		price:'',
		mark_price:'',
		pic:_data_.picsPath,
		cover:_data_.picsPath[0],
		detail:'',
		discount:'',
	};
	this.echo(JSON.stringify(data));
	this.exit();
}).then(function () {
	waitTimer.call(this,false);
}).then(function () {

	data = this.evaluate(function () {

		function trim(string) {
			return String(string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
		}

		var title = trim(My$('.tb-detail-hd').first().find('h1').text());
		var price = My$('#J_PromoPrice .tm-price').first().text().replace(/[^\d\.]/g,'');
		var mark_price = My$('#J_StrPriceModBox .tm-price').first().text().replace(/[^\d\.]/g,'');

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
			p = p.replace(/\.jpg_\d+x\d+q\d+\.jpg/ig,'.jpg');
			pic.push(p);
		});

		var detail = (My$('#description > .content').first().html()||'').replace(/^\s+|\s+$/g,'');
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

	data.url   = casper.url;
	this.echo(JSON.stringify(data));
	this.exit();
});

casper.run(function(){
    this.exit();
});


