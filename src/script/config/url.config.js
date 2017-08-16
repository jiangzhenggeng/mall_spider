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
        hasInsertDom:function (_self) {
            var p_obj = $(_self).closest('li.gl-item');
            if( p_obj.length ){
                return p_obj;
            }
            return null;
        },
        getItemData:function (_self) {
            var pic = [];
            $(_self).find('.ps-item').find('img').each(function () {
                var p = $(this).attr('src');
                if(p.substr(0,2)=='//') p = 'http:'+p;
                p = p.replace(/(\/n\d+\/jfs\/|\/n\d+\/[a-z]\d+[a-z]\d+_jfs\/)/ig,'/n0/jfs/').replace(/\/\d+_jfs\//i,'/jfs/');
                pic.push(p);
            });
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
        mall: '亚马逊中国',
        shop: 'amazon',
        host: 'www.amazon.cn',
        hasInsertDom: amazon.hasInsertDom,
        getItemData: amazon.getItemData,
    },
    {
        mall: '亚马逊美国',
        shop: 'amazon',
        host: 'www.amazon.com',
        hasInsertDom: amazon.hasInsertDom,
        getItemData: amazon.getItemData,
    }
];












