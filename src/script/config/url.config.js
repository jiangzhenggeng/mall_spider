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
    }
}

var URL_CONFIG = [
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
                    p = p.replace(/\.jpg_\d+x\d+(q\d+|)\.jpg/ig,'.jpg');
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
              p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n1/s800x1026_jfs/');

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
                price:$(_self).find('.p-price strong').text(),
                mark_price:'',
                pic:pic,
            };
        }
    },
    {
        mall:'淘宝',
        shop:'taobao',
        host:'item.taobao.com',
      logo:'http://s1.jiguo.com/8f4a3247-da08-4142-87a8-19eb29917716',
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
        }
    },
    {
        mall:'网易考拉',
        shop:'kaola',
        host:'product',
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
        }
    },
    {
        mall:'网易严选',
        shop:'yanxuan',
        host:'item',
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
        }
    },
    {
        mall:'优集品',
        shop:'ujipin',
        host:'goods',
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
        }
    },
    {
        mall: '亚马逊中国',
        shop: 'amazon',
        host: 'www.amazon.cn',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/amazon.jpg',
        hasInsertDom: amazon.hasInsertDom,
        getItemData: amazon.getItemData,
    },
    {
        mall: '亚马逊美国',
        shop: 'amazon',
        host: 'www.amazon.com',
      logo:'http://cdn.jiguo.com/zdm/asset/mall/amazon.jpg',
        hasInsertDom: amazon.hasInsertDom,
        getItemData: amazon.getItemData,
    }
];












