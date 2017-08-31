/**
 * Created by jiangzg on 2017/8/7.
 */

function createId() {
  return 'id-'+(Math.random().toString().replace('.',''));
}

var tpl = `<div v-if="showModal" class="spread-wrap" data-front>
        <div ref="spread-download" class="spread">
            <div class="spread-header" contenteditable="true">每日大牌折扣</div>
            <div class="spread-body">
                <div class="spread-flage" v-if="discount>0 && discount<10">
                    <img src="${My$.pluginsPath}images/i-discount.png">
                    <div class="spread-discount">{{ discount }}折</div>
                </div>
                <img :src="spread.cover"
                    @mousedown.stop.prevent="mousedown"
                    @mousemove.stop.prevent="mousemove"
                    @mouseup.stop.prevent="mouseup"
                    @mouseout.stop.prevent="mouseout"
                    ref="spread-cover"
                />
            </div>
            <div class="spread-desc">
                <div class="spread-tedian" contenteditable="true">
                    <span class="spread-red">产品特点：</span><span>{{ spread.desc?spread.desc:(spread.title?spread.title:'填写商品特点') }}</span>
                </div>
                <div class="spread-erweima">
                    <div class="spread-bottom-left">
                        <img :src="erweima">
                        <div contenteditable="true">长按二维码立即下单</div>
                    </div>
                    <div class="spread-bottom-right">
                        <div class="spread-title" contenteditable="true">{{ spread.title?spread.title:'填写商品' }}</div>
                        <div class="spread-price">
                            <span class="spread-red">现价:<span contenteditable="true" @keyup="keyup('price',$event)">{{ spread.price }}</span>元</span>
                            <span class="spread-gray">原价:<span contenteditable="true" @keyup="keyup('mark_price',$event)">{{ spread.mark_price }}</span>元</span>
                        </div>
                        <div class="spread-logo">
                            <img :src="spread.logo">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 110px;text-align: center">
          <div @click="downLoad" class="spread-download-png">下载</div>
          <div @click="downLoadWindowClose" class="spread-download-png spread-download-close">关闭</div>
          <div class="spread-download-png model-spread-cover-wrap">
          图片
            <input id="model-spread-cover" @change="coverChange($event)" type="file" name="cover" class="model-spread-cover" accept="image/jpg,image/jpeg,image/png,image/gif">
          </div>
          <div style="margin-top: 20px">
            <span v-if="noCps=='check'" class="spread-green spread-cps">CPS正在检查中...</span>
            <span v-else-if="noCps=='no-cps'" class="spread-red spread-cps">没有CPS链接</span>
            <span class="spread-green spread-cps" v-else="noCps=='ok-cps'">有CPS链接</span>
           </div>
        </div>
    </div>`;

var id = createId()+'009--lpo';

$('body').append('<div id="'+id+'">'+tpl+'</div>');

var app = new Vue({
  el: '#'+id,
  data: {
    showModal:false,
    spread:{},
    link_next_data:{},
    triggerObj:null,
    app:$('#'+id),
    url:'',
    mouse:{},
    moveImg:null,
  },
  computed:{
    erweima:function () {
      if(!this.url){
        return $.pluginsPath+'images/no.png';
      }
      this.app.qrcode({
        width:"106",
        height:"106",
        text:this.url
      });
      var imgData = this.app.find('canvas')[0].toDataURL("image/png",1);
      this.app.find('canvas').remove();
      return imgData;
    },
    discount:function () {
      if( this.spread.mark_price && this.spread.price ){
        this.spread.discount = Number(this.spread.price / this.spread.mark_price * 10).toFixed(1);
      }else {
        this.spread.discount = 0;
      }
      return this.spread.discount;
    }
  },
  methods:{
    coverChange:function () {
      var reader = new FileReader();
      var _this = this;
      reader.onload = function(e) {
        _this.spread.cover = e.target.result;
        _this.spread = {
          ..._this.spread
        };
      };
      reader.readAsDataURL( document.getElementById('model-spread-cover').files[0] );
    },
    keyup:function (name,e) {
      this.timer && clearTimeout(this.timer);

      this.timer = setTimeout(()=>{
        this.spread[name] = $(e.srcElement).text();
        this.spread = {
          ...this.spread
        };
      },800);
    },
    showModelSpread(id,item){
      this.showModal = true;
      this.spread = item;
      if( !this.spread.cover ){
        this.spread.cover = this.spread.pic?this.spread.pic[0]:'';
      }

      this.url = this.spread.url;

      var promise = new Promise((resolve, reject)=>{
        chrome.runtime.sendMessage({
          type:'get-check-cps',
          url:this.url
        });
        window.bindMessage['get-check-cps-replay'] = resolve;

      }).then( replayDate =>{

        if(this.url==replayDate || !replayDate){
          this.noCps = 'no-cps';
        }else{
          this.noCps = 'ok-cps';
          this.url = replayDate;
        }

        return new Promise((resolve, reject)=>{

          var pic = {
            type:5,
            caption:'每日大牌折扣',
            url:this.spread.url,
            title:this.spread.title,
            price:this.spread.price,
            price2:this.spread.mark_price,
            description:'',
            cover:this.spread.cover,
            'cover-mall':this.spread.logo
          };

          chrome.runtime.sendMessage({
            type:'get-save-card-data',
            pic:pic,
            discount:this.spread.discount
          });

          window.bindMessage['get-save-card-data-replay'] = resolve;

        });
      }).then( replayDate =>{
        if(replayDate.status==0){
          this.url = replayDate.short_url;
        }
      });

    },
    downLoadWindowClose(){
      this.showModal = false;
      var detail = $('.my-spider-detail');
      if(detail.length){
        detail.show();
      }
    },
    downLoad(){
      //触发截图
      chrome.runtime.sendMessage({
        type:'get-bcActiveTab',
        data:this.link_next_data,
        info:{
          offsetLeft: $(app.$refs['spread-download']).offset().left,
          offsetTop: $(app.$refs['spread-download']).offset().top,
          height: $(app.$refs['spread-download']).height(),
          width: $(app.$refs['spread-download']).width(),
          scrollTop:$(window).scrollTop(),
          scrollLeft:$(window).scrollLeft()
        }
      }, response => {
        if( this.triggerObj ){
          if(response.result=='ok'){
            this.triggerObj.addClass('my-spider-link-success').html('传播图生成成功');
            this.showModal = false;

            var detail = $('.my-spider-detail');
            if(detail.length){
              detail.show();
            }

          }else{
            this.triggerObj.addClass('my-spider-link-error').html('传播图生成失败');
          }
        }
      });
    },

    mousedown(e){
      this.moveImg = this.moveImg?this.moveImg:$(this.$refs['spread-cover']);

      this.mouse.lock = true;
      this.mouse.start_x = e.clientX;
      this.mouse.start_y = e.clientY;
      this.mouse.start_mgt = parseInt( this.moveImg.css('top') );
    },
    mousemove(e){
      if(this.mouse.lock){
        this.mouse.end_x = e.clientX;
        this.mouse.end_y = e.clientY;

        this.mouse.move_x = this.mouse.start_x - this.mouse.end_x;
        this.mouse.move_y = this.mouse.start_y - this.mouse.end_y;
        //console.log( this.mouse.start_mgt ,-this.mouse.move_y );
        this.moveImg.css('top', this.mouse.start_mgt - this.mouse.move_y );
      }
    },
    mouseup(e){
      this.mouse.lock = false;
      this.mouse.end_x = e.clientX;
      this.mouse.end_y = e.clientY;
    },
    mouseout(e){
      this.mouseup(e);
    }
  }
});


(function () {
    var $ = My$;

    var loadHuihui = function (box,url,callback) {

      callback = callback || function () {};
        //加载慧慧的价格数据
        var t = new Date().getTime();
        var callbackName = 'youdaogouwupi'+t;
        //注册回调函数
        window[callbackName] = function (json) {
            box.data('huihui-json',json);
            box.attr('data-huihui-json','ok').find('.my-spider-loading-huihui-data').remove();
            callback(json);
          window[callbackName] = null;
        };
        box.append('<span class="my-spider-loading-huihui-data">加载中...</span>');
        $.ajax({
            url: "https://zhushou.huihui.cn/productSense",
            type: 'GET',
            data: {
                jsonp:callbackName,
                phu:url,
                type:'canvas',
                t:t
            },
            cache: false,
            dataType: 'html',
            success: function (replatData) {
                eval(replatData);
            },
            error:function () {
              window[callbackName]({});
            }
        });
    };

    $('body').on('mouseenter','a[href]',function () {
        if( $(this).data('already-wrap-box') ){
            $(this).data('already-wrap-box').find('.my-spider-link-next').show();
            return;
        }

        var url = $(this).attr('href');
        url = url.substr(0,2)=='//'?'http:'+url:url;

        if( $(this).data('already-mark') || !url ) return;
        var result = $.parseUrl(url);
        if(!result.host) return;
        var _this = $(this), box = null;
      result.host = result.host.toLocaleLowerCase();

        URL_CONFIG.forEach(function(item, index){
            if( $.inArray(result.host,$.isArray(item.host)?item.host:[item.host])>-1 ){
                box = item.hasInsertDom(_this);
                _this.data('already-wrap-box',box);

                if( box ){

                    if( box.attr('data-huihui-json')!='ok'){
                        loadHuihui(box,url);
                    }
                    var pos = box.css('position');
                    if(pos!='fixed' && pos!='relative' && pos!='absolute'){
                        box.css('position','relative');
                    }
                    box.addClass('my-spider-link-wrap');
                    box.append('<span class="my-spider-link-next">采集</span>');
                    box.append('<span class="my-spider-spread-image">生成传播图</span>');
                    _this.data('already-mark','ok');
                    var _span = box.find('.my-spider-link-next');
                    _span.data('already-item',item);
                    _span.data('already-wrap-box',box);
                    return false;
                }
            }
        });
    }).on('click','.my-spider-link-next',function (e,resolve,reject) {
        var _this = $(this);
        if( _this.hasClass('my-spider-link-already') ) return;
        var config_item = _this.data('already-item');
        var item_data = config_item.getItemData( _this.data('already-wrap-box') );
        item_data.logo = config_item.logo;

        if( item_data.url && item_data.url.substr(0,2)=='//' ){
            item_data.url = 'http:'+item_data.url;
        }

        var box = _this.data('already-wrap-box');
        var huihui_json = box.data('huihui-json') || {};
        
        if(!item_data.price) item_data.price = huihui_json.today || huihui_json.min;
        if(!item_data.mark_price) item_data.mark_price = huihui_json.max;

        item_data.price = $.priceFn(item_data.price);
        item_data.mark_price = $.priceFn(item_data.mark_price);

        item_data.mall = config_item.mall;
        item_data.shop = config_item.shop;
        if(item_data.price && item_data.mark_price && item_data.price!=item_data.mark_price && item_data.price<item_data.mark_price){
            item_data.discount = Number( item_data.price / item_data.mark_price * 10 ).toFixed(1);
        }

        item_data.pic = item_data.pic.map(function (item) {
            return $.extendUrl(item);
        });

        _this.data('already-catch-data',item_data);

        chrome.runtime.sendMessage({
            type:'get-item-html',
            data:item_data
        }, function(response){
            if(response.result=='ok'){
                _this.addClass('my-spider-link-success').html('已采集');
                resolve(item_data);
            }else{
                _this.addClass('my-spider-link-error').html('采集失败');
              reject('采集失败');
            }
        });
    }).on('click','.my-spider-spread-image',function () {
        //生成传播图
      var _this = $(this);
      var promise = new Promise(function(resolve, reject) {
        resolve();
      });
      app.triggerObj = _this;

      var link_next,link_next_data;

      link_next = _this.parent().find('.my-spider-link-next');

      promise.then(()=>{
        return new Promise((resolve, reject)=>{
          link_next.trigger('click',[resolve, reject]);
        });
      }).then(()=>{

        link_next_data = link_next.data('already-catch-data');
        app.link_next_data = link_next_data;
        app.url = link_next_data.url;

        return new Promise((resolve, reject)=>{
          app.showModelSpread(null,link_next_data);
          resolve();
        });

      });

    });

    //详细页面


  var __result__ = $.parseUrl(window.location.href),
      __curr_item__ = {},
      __huihui_json__ = {};

  loadHuihui($('body'),window.location.href,function (dataSource) {
    if( dataSource ){
      __huihui_json__ = dataSource;
    }
  });

  URL_CONFIG.forEach(function(item, index){
    if( $.inArray(__result__.host,$.isArray(item.host)?item.host:[item.host])>-1 ){
      var yicaiji = false;
      (window.storeData||[]).forEach((_item)=>{
        if( _item.url == window.location.href ){
          yicaiji = true;
        }
      });
      __curr_item__ = item;
      var tpl = `
        <div class="my-spider-detail">
            <span class="my-spider-detail-acquisition ${yicaiji?'success':''}">${yicaiji?'已采集':'采集'}</span>
            <span class="my-spider-detail-generation">生成传播图</span>
        </div>
      `;
      $('body').append( tpl );
    }
  });

  $('body').on('click','.my-spider-detail-acquisition',function (e,resolve,reject) {
    var _this = $(this);
    var config_item = __curr_item__,
        huihui_json = __huihui_json__;
    if( !config_item.getDetailData ){
      new Error('getDetailData 方法没有定义！');
      return;
    }
    var item_data = config_item.getDetailData( $('body') );

    item_data.logo = config_item.logo;
    item_data.url = window.location.href;

    if(!item_data.price) item_data.price = huihui_json.today || huihui_json.min;
    if(!item_data.mark_price) item_data.mark_price = huihui_json.max;

    item_data.price = $.priceFn(item_data.price);
    item_data.mark_price = $.priceFn(item_data.mark_price);

    item_data.mall = config_item.mall;
    item_data.shop = config_item.shop;
    if(item_data.price && item_data.mark_price && item_data.price!=item_data.mark_price && item_data.price<item_data.mark_price){
      item_data.discount = Number( item_data.price / item_data.mark_price * 10 ).toFixed(1);
    }

    item_data.pic = item_data.pic.map(function (item) {
      return $.extendUrl(item);
    });

    _this.data('already-catch-data',item_data);

    chrome.runtime.sendMessage({
      type:'get-item-html',
      data:item_data
    }, function(response){
      if(response.result=='ok'){
        _this.addClass('success').html('已采集');
        typeof resolve=='function' && resolve();
      }else{
        _this.addClass('error').html('采集失败');
        typeof reject=='function' && reject();
      }
    });

  }).on('click','.my-spider-detail-generation',function () {

    var _this = $(this),
        prev = _this.prev();

    new Promise((resolve)=>{
      resolve();
    }).then(()=>{
      return new Promise((resolve,reject)=>{
        prev.trigger('click',[resolve,reject]);
      })
    }).then(()=>{
      var link_next_data = prev.data('already-catch-data');
      //生成传播图
      app.triggerObj = _this;
      app.link_next_data = link_next_data;
      app.url = link_next_data.url;
      app.showModelSpread(null,link_next_data);
    }).then(()=>{
      _this.parent().hide();
    });

  });


})();





window.bindMessage = {};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

  if(message.type=='get-check-cps-replay'){

    window.bindMessage && window.bindMessage[message.type] && window.bindMessage[message.type](message.data);

  }else if(message.type=='get-save-card-data-replay'){

    window.bindMessage && window.bindMessage[message.type] && window.bindMessage[message.type](message.data);

  }else if( message.type=='set-store' ){
    window.storeData = message.storeData || [];
  }

});


chrome.runtime.sendMessage({
  type:'get-store'
}, function(response){
  window.storeData = response.storeData || [];
});









