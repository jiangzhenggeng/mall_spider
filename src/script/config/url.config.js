/**
 * Created by jiangzg on 2017/8/7.
 */

var amazon = {
    hasInsertDom:function (_self) {
        var p_obj = $(_self).closest('li[data-action="sx-detail-display-trigger"]');
        if( p_obj.length ){
            return p_obj;
        }
        var p_obj = $(_self).closest('.singleCell[id]');
        if( p_obj.length ){
            return p_obj;
        }
        //美国亚马逊 搜索关键词
        var p_obj = $(_self).closest('li.s-result-item');
        if( p_obj.length ){
            return p_obj;
        }
        return null;
    },
    getItemData:function (_self) {
        var pic = [];
        $(_self).find('a.a-link-normal[href]').find('img').each(function () {
            var p = $(this).attr('src');
            if(p.substr(0,2)=='//') p = 'http:'+p;
            p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
            pic.push(p);
        });

        var title = $(_self).find('h2.s-access-title').text() ||
            $(_self).find('span#dealTitle').first().text();
        var price = $(_self).find('.a-color-price.s-price').text() ||
            $(_self).find('.priceBlock').text() ||
            $(_self).find('.s-color-subdued>.a-spacing-none>a>.a-size-small').text();
        var url = $(_self).find('a.a-link-normal').attr('href');
        return {
            title:title,
            url:url,
            price:price,
            mark_price:'',
            pic:pic,
        };
    },
  getDetailData(){
    var title = trim(My$('#productTitle').first().text());

    var price = priceFn( My$('#priceblock_dealprice').text() ) || priceFn(My$('#priceblock_saleprice_row').find('#priceblock_saleprice').text()) || priceFn( My$('#olp_feature_div').find('.a-color-price').text() );
    var mark_price = priceFn(My$('#priceblock_ourprice').text()) || priceFn( My$('#price .a-text-strike').text() ) || priceFn(My$('#price td').eq(1).text());

    var discount = '';
    if(price && mark_price){
      discount = (price/mark_price * 10).toFixed(1);
      if(discount<=0 || discount>=10 )discount = '';
    }
    var pic = [];
    My$('#altImages li:not(.aok-hidden) img').each(function () {
      var p = My$(this).attr('src');
      if(p.substr(0,2)=='//'){
        p = 'http:'+p;
      }
      p = p.replace(/\.\_(.*?)\_\.jpg$/ig,'.jpg');
      pic.push(p);
    });

    var detail = (My$('#productDescription').html()||'').replace(/^\s+|\s+$/g,'');
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
      discount:discount,
      url:window.location.href
    };
  }
}

function trim(string) {
  return (string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
}

function priceFn(string) {
  return (string||'').split('-')[0].replace(/[^\d\.]/g,'');
}

var URL_CONFIG = [
  {
    mall:'天猫',
    shop:'jutaobao',
    host:['ju.taobao.com','detail.ju.taobao.com'],
    logo:'http://cdn.jiguo.com/zdm/asset/mall/tmall.jpg',
    hasInsertDom:function (_self) {
      var p_obj = $(_self).closest('li.item-small-v3');
      if( p_obj.length ){
        return p_obj;
      }
      var p_obj = $(_self).closest('li.item-big-v2');
      if( p_obj.length ){
        return p_obj;
      }
      return null;
    },
    getItemData:function (_self) {
      var obj = {};
      var pic = [];
      $(_self).find('.item-pic,.link-box').find('img').each(function () {
        var p = $(this).attr('src');
        if(p){
          p = p.replace(/\.([a-z\d]{3})_\d+x\d+(q\d+|)\.jpg/ig,'.\$1');
          pic.push( p );
        }
      });

      obj.pic = pic;

      if(_self.hasClass('item-big-v2')){
        obj.title = trim($(_self).find('.shortname').text());
        obj.url = $(_self).find('.link-box').attr('href');
        obj.price = priceFn($(_self).find('.row-price .price .yen').text());
        obj.mark_price = priceFn($(_self).find('.row-price .price .oriPrice').text());
      }

      if(_self.hasClass('item-small-v3')){
        obj.title = trim($(_self).find('h4 .desc').text());
        obj.url = $(_self).find('.link-box').attr('href');
        obj.price = priceFn($(_self).find('.price .yen').text());
        obj.mark_price = priceFn($(_self).find('.dock .orig-price').text());
      }

      return obj;
    },
    getDetailData:function () {

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
        url: url || window.location.href,
        title:title,
        price:price,
        mark_price:mark_price,
        pic:pic,
        cover:pic[0],
        detail:detail,
        discount:discount
      };
    }
  },
    {
        mall:'天猫',
        shop:'tmall',
        host:'detail.tmall.com',
        logo:'http://cdn.jiguo.com/zdm/asset/mall/tmall.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('.product[data-id][data-atp]');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.ks-switchable-content').find('img').each(function () {
                var p = $(this).attr('src');
                if(p){
                    p = p.replace(/\.([a-z\d]{3})_\d+x\d+(q\d+|)\.jpg/ig,'.\$1');
                    pic.push( p );
                }
            });
            return {
                title:$(_self).find('.productTitle').text(),
                url:$(_self).find('.productImg-wrap').find('a').attr('href'),
                price:$(_self).find('.productPrice').find('em').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData:function () {

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
          p = p.replace(/\.([a-z\d]{3})_\d+x\d+q\d+\.jpg/ig,'.\$1');
          pic.push(p);
        });

        var detail = (My$('#description > .content').first().html()||'').replace(/^\s+|\s+$/g,'');
        if ( !detail ) {
          pic.forEach(function (item) {
            detail += '<img src="'+item+'" />';
          });
        }
        return {
          url:window.location.href,
          title:title,
          price:price,
          mark_price:mark_price,
          pic:pic,
          cover:pic[0],
          detail:detail,
          discount:discount
        };
      }
    },
    {
        mall:'京东',
        shop:'jd',
        host:'item.jd.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/jd.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.gl-item');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];

            var picFn = function (p) {
              if(p.substr(0,2)=='//') p = 'http:'+p;
              p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/imgzone/jfs/');

              return p;
            };

            $(_self).find('.ps-item').find('img').each(function () {
                pic.push( picFn($(this).attr('src')) );
            });
            if( !pic.length ){
              $(_self).find('.p-img').find('img').each(function () {
                pic.push( picFn($(this).attr('src')) );
              });
            }

            return {
                title:$(_self).find('.p-name a em').text(),
                url:$(_self).find('.p-name a').attr('href'),
                price:$(_self).find('.p-price .J_price').first().text() || $(_self).find('.p-price i').first().text(),
                mark_price:'',
                pic:pic,
            };
        },
          getDetailData:function (_self) {

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
                p = 'https://img14.360buyimg.com/imgzone/'+My$(this).attr('data-url');
              }else{
                p = My$(this).attr('src');
                if(p.substr(0,2)=='//'){
                  p = 'http:'+p;
                }
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/imgzone/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
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
              url: window.location.href ,
              title:title,
              price:price,
              mark_price:mark_price,
              pic:pic,
              cover:pic[0],
              detail:detail,
              discount:discount
            };


          }
    },
    {
        mall:'淘宝',
        shop:'taobao',
        host:['item.taobao.com','detail.tmall.com'],
       logo:'http://cdn.jiguo.com/zdm/asset/mall/tmall.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('div.item');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.pic').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.title a').text(),
                url:$(_self).find('.title a').attr('href'),
                price:$(_self).find('.price strong').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData(){
        var title = trim(My$('#J_Title h3.tb-main-title').first().text());
        var price = My$('#J_PromoPriceNum').text().replace(/[^\d\.]/g,'');
        var mark_price = My$('#J_StrPriceModBox .tb-rmb-num').first().text().replace(/[^\d\.]/g,'');

        var discount = '';
        if(price && mark_price){
          discount = (price/mark_price * 10).toFixed(1);
          if(discount<=0 || discount>=10 )discount = '';
        }
        if(!price){
          price = mark_price;
          mark_price = '';
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
          url:window.location.href,
          title:title,
          price:price,
          mark_price:mark_price,
          pic:pic,
          cover:pic[0],
          detail:detail,
          discount:discount
        };
      }
    },
    {
        mall:'苏宁',
        shop:'suning',
        host:'product.suning.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/suning.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.product');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.img-block').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.sell-point a').text(),
                url:$(_self).find('.sell-point a').attr('href'),
                price:$(_self).find('.prive-tag .price').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData(){
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
          url:window.location.href,
          title:title,
          price:price,
          mark_price:mark_price,
          pic:pic,
          cover:pic[0],
          detail:detail,
          discount:discount
        };
      }
    },
    {
        mall:'网易考拉',
        shop:'kaola',
        host:['www.kaola.com'],
        logo:'http://cdn.jiguo.com/zdm/asset/mall/kaola.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.goods');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.img').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.title h2').text(),
                url:$(_self).find('.goodswrap>a').attr('href'),
                price:$(_self).find('.price .cur').text(),
                mark_price:$(_self).find('.price .marketprice').text(),
                pic:pic,
            };
        },
      getDetailData(){
        var title = trim(My$('.product-title').first().text() );

        var price = priceFn(My$('.m-price-wrap .m-price-cnt .currentPrice').text() );
        var mark_price = priceFn(My$('.m-price-wrap .m-price-cnt .marketPrice').text() );

        var discount = '';
        if(price && mark_price){
          discount = (price/mark_price * 10).toFixed(1);
          if(discount<=0 || discount>=10 )discount = '';
        }
        var pic = [];
        My$('#litimgUl').find('li img').each(function () {
          var p = My$(this).attr('src');
          if(p.substr(0,2)=='//'){
            p = 'http:'+p;
          }
          p = p.split('&thumbnail')[0];
          pic.push(p);
        });

        var detail = (My$('#textareabox').html()||'').replace(/^\s+|\s+$/g,'');
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
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'1号店',
        shop:'yhd',
        host:'item.yhd.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/yhd.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('div.mod_search_pro');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.proImg').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.proName a').text(),
                url:$(_self).find('.proImg a').attr('href'),
                price:$(_self).find('.proPrice em').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData(){
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
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'国美',
        shop:'gome',
        host:'item.gome.com.cn',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/gome.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.product-item');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.item-pic').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.item-name a').text(),
                url:$(_self).find('.item-name a').attr('href'),
                price:$(_self).find('.item-price .price').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData(){
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
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'当当',
        shop:'dangdang',
        host:'product.dangdang.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/dangdang.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li[ddt-pit]');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.pic').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.name a').text(),
                url:$(_self).find('.name a').attr('href'),
                price:$(_self).find('.price_n').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData(){
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
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'网易严选',
        shop:'yanxuan',
        host:['you.163.com'],
        logo:'http://cdn.jiguo.com/zdm/asset/mall/yanxuan.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.item');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.hd').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.name a span:last-of-type').text(),
                url:$(_self).find('.name a').attr('href'),
                price:$(_self).find('.price span:first-of-type').text(),
                mark_price:'',
                pic:pic,
            };
        },
      getDetailData(){
        var title = trim(My$('.intro').first().find('.name').text() );

        var price = priceFn(My$('.price .pBox .rp .num').text() );
        var mark_price = priceFn( My$('.price .pBox .op s').eq(0).text() );

        var discount = '';
        if(price && mark_price){
          discount = (price/mark_price * 10).toFixed(1);
          if(discount<=0 || discount>=10 )discount = '';
        }
        var pic = [];
        My$('.m-slide .list').find('li img').each(function () {
          var p = My$(this).attr('src');
          if(p.substr(0,2)=='//'){
            p = 'http:'+p;
          }
          p = p.split('&thumbnail')[0];
          pic.push(p);
        });
        var descObj = My$('.m-detailHtml');
        descObj.find('ul.m-attrList').remove();
        descObj.find('img[data-original]').each(function () {
          var src = My$(this).attr('data-original');
          if(src.substr(0,2)=='//') src = 'http:'+src;
          My$(this).attr('src',src);
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
          mark_price:mark_price ,
          pic:pic,
          cover:pic[0],
          detail:detail,
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'优集品',
        shop:'ujipin',
        host:'www.ujipin.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/youjipin.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('dl');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('dt').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.goods_introduce a').text(),
                url:$(_self).find('.goods_introduce a').attr('href'),
                price:$(_self).find('.goods_price .special_price').text(),
                mark_price:$(_self).find('.goods_price .market_price').text(),
                pic:pic,
            };
        },
      getDetailData(){
        var discount = '',detail = '',price = '',mark_price = '';
        var _input_val_ = My$('#goods_data-input').val();
        if( _input_val_ ){
          var _input_val_json_ = JSON.parse(_input_val_);

          price = _input_val_json_.goods_price || '';
          mark_price = _input_val_json_.market_price || '';
          if(price && mark_price){
            discount = (price/mark_price * 10).toFixed(1);
            if(discount<=0 || discount>=10 )discount = '';
          }
          var _detail_ = _input_val_json_.story.slices;
          My$.each(_detail_,function (index,item) {
            detail += '<p>'+item.content + '</p>' + '<p><img src="'+item.image+'" /></p>';
          });
          return {
            brand:_input_val_json_.brand.name,
            title:_input_val_json_.goods_name,
            price:price,
            mark_price:mark_price,
            url:window.location.href,
            pic:_input_val_json_.splash,
            cover:_input_val_json_.splash[0],
            detail:detail,
            discount:discount
          };
        }else{
          var title = trim( My$('.good-right .title').text());

          price = priceFn( My$('#goods_price').text() );
          mark_price = priceFn( My$('.market_value').parent().text() );

          if(price && mark_price){
            discount = (price/mark_price * 10).toFixed(1);
            if(discount<=0 || discount>=10 )discount = '';
          }
          var pic = [];
          My$('#thumblist').find('li img').each(function () {
            var p = My$(this).attr('src');
            if(p.substr(0,2)=='//'){
              p = 'http:'+p;
            }
            pic.push(p);
          });

          detail = (My$('.detial_show').html()||'').replace(/^\s+|\s+$/g,'');
          if ( !detail ) {
            pic.forEach(function (item) {
              detail += '<img src="'+item+'" />';
            });
          }
        }

        return {
          title:title,
          price:price ,
          mark_price:mark_price ,
          pic:pic,
          cover:pic[0],
          detail:detail,
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'西集网',
        shop:'xiji',
        host:'www.xiji.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/xiji.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.goods-item');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.goods-pic').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.goods-name a').text(),
                url:$(_self).find('.goods-name a').attr('href'),
                price:$(_self).find('.goods-price ins.price').text(),
                mark_price:$(_self).find('.goods-price del.price').text(),
                pic:pic,
            };
        },
      getDetailData(){
        var title = trim( My$('.product-titles-inner h1').text());

        var price = priceFn( My$('.action-price').text() );
        var mark_price = priceFn( My$('.action-mktprice').text() );

        var discount = '';
        if(price && mark_price){
          discount = (price/mark_price * 10).toFixed(1);
          if(discount<=0 || discount>=10 )discount = '';
        }
        var pic = [];
        My$('#product_album .thumbnail-list').eq(0).find('li img').each(function () {
          var p = My$(this).attr('src');
          if(p.substr(0,2)=='//'){
            p = 'http:'+p;
          }
          pic.push(p);
        });

        var detail = (My$('.detail-content').html()||'').replace(/^\s+|\s+$/g,'');
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
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall:'优购',
        shop:'yougou',
        host:'www.yougou.com',
        logo:'http://cdn.jiguo.com/zdm/asset/mall/yougou.jpg',
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('div.srchlst-wrap');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.hd').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
            return {
                title:$(_self).find('.nptt a').text(),
                url:$(_self).find('.nptt a').attr('href'),
                price:$(_self).find('.price_sc em').text(),
                mark_price:$(_self).find('.price_sc del').text(),
                pic:pic,
            };
        },
      getDetailData(){
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
          discount:discount,
          url:window.location.href
        };
      }
    },
    {
        mall: '亚马逊中国',
        shop: 'amazon',
        host: ['www.amazon.com','www.amazon.cn'],
      logo:'http://cdn.jiguo.com/zdm/asset/mall/amazon.jpg',
        hasInsertDom: amazon.hasInsertDom,
        getItemData: amazon.getItemData,
      getDetailData: amazon.getDetailData,
    },
    {
        mall: '亚马逊美国',
        shop: 'amazon',
        host: ['www.amazon.com','www.amazon.cn'],
      logo:'http://cdn.jiguo.com/zdm/asset/mall/amazon.jpg',
        hasInsertDom: amazon.hasInsertDom,
        getItemData: amazon.getItemData,
      getDetailData: amazon.getDetailData,
    }
];












