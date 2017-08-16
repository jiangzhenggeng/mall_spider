
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

		var title = trim(My$('.sku-name').first().text());
		var price = My$('.summary-price.J-summary-price .dd .p-price').first().text().replace(/[^\d\.]/g,'');
		var mark_price = My$('#page_origin_price').text().replace(/[^\d\.]/g,'');

		var discount = '';
		if(price && mark_price){
			discount = (price/mark_price * 10).toFixed(1);
			if(discount<=0 || discount>=10 )discount = '';
		}
		var pic = [];
		My$('#spec-list li img').each(function () {
			var p = '';
			if(My$(this).attr('data-url')){
				p = 'https://img14.360buyimg.com/n0/'+My$(this).attr('data-url');
			}else{
				p = My$(this).attr('src');
				if(p.substr(0,2)=='//'){
					p = 'http:'+p;
				}
				p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
			}
			pic.push(p);
		});

		var descObj = My$('#J-detail-content');
		descObj.find('div').each(function () {
			var img_src = ($(this).css('background-image')||'').replace(/\s+/g,'').replace(/^url\(("|'|)|("|'|)\)$/gi,'');
			img_src && $(this).append('<img src="'+img_src+'" />');
		});
		descObj.find('img[data-lazyload]').each(function () {
			var src = My$(this).attr('data-lazyload');
			if(src.substr(0,2)=='//') src = 'http:'+src;
			My$(this).attr('src',src).removeAttr('class').removeAttr('alt').removeAttr('data-lazyload').removeAttr('id');
		});
		descObj.find('[style]').removeAttr('style');
		var detail = (descObj.html()||'').replace(/^\s+|\s+$/g,'');

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
	data.logo = 'cd34e2af-18b5-4b03-b44e-d13a92aa2693';
	data.mall_type = 'jd';
	this.echo(JSON.stringify(data,null,2));
	this.exit();
});


casper.run(function(){
    this.exit();
});




