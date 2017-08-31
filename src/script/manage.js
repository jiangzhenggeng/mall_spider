
Vue.component('modal', {
  template: `<transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header" v-if="hasHeader">
                        <slot name="header"></slot>
                    </div>
                    <div class="modal-body" v-if="hasBody">
                        <slot name="body"></slot>
                    </div>
                    <div class="modal-footer" v-if="hasFooter">
                        <slot name="footer">
                            <button class="modal-default-button" @click="$emit('close')"></button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>`,
  computed:{

    hasHeader() {
      return !!this.$slots.header;
    },
    hasBody() {
      return !!this.$slots.body;
    },
    hasFooter() {
      return !!this.$slots.footer;
    },
  }

});


var app = new Vue({
    el: '#app',
    data: {
        shop:'',
        keyword:'',
        popup: window.location.href.split('?')[1]=='popup',
        pic:[],
        showModal:false,
      spread:{},
      sort_price_type_acs:true,
      sort_discount_type_acs:true,
      sort_curr:'price',
      list_len:0,

      app:$('#app'),
      url:'',
      mouse:{},
      moveImg:null,

      page:{
          total:200,
          size:2,
          showPageSize:5,
      },
      noCps:'check'
    },
  computed:{

      discount:function () {
        if( this.spread.mark_price && this.spread.price ){
          this.spread.discount = Number(this.spread.price / this.spread.mark_price * 10).toFixed(1);
        }else {
          this.spread.discount = 0;
        }
        return this.spread.discount;
      },
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
      list:function () {
        //搜索

        var data = store.get('data')||[];
        this.list_len;
        data = data.filter( item => {
          if( this.shop && item.shop!= this.shop ) return false;
          return true;
        });
        data = data.filter( item => {
          if(this.keyword && item.title.indexOf(this.keyword)==-1) return false;
          return true;
        });

        var sort_curr='sort_price_type_acs',sort_key='price';
        if(this.sort_curr=='discount'){
          sort_curr = 'sort_discount_type_acs';
          sort_key = 'discount';
        }
        var r=0;
        return data.sort((a,b)=>{
          if( this[sort_curr] ){
            r = a[sort_key]-b[sort_key];
          }else{
            r = b[sort_key]-a[sort_key];
          }
          r = isNaN(r)?( a[sort_key]?-1:( b[sort_key]?1:-1 ) ):r;
          return r;
        });

        sendMessageToContentScript && sendMessageToContentScript({
          type:'set-store',
          storeData:store.get('data')
        });
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
        deleteItem:function (id,item) {

            var index = -1,data = this.list;
            data.forEach(function (_item,_index) {
               if(_item.id==id) index = _index;
            });
            if(index>-1){
                this.list.splice(index,1);
                store.set('data',this.list);
              this.list_len = this.list.length;
            }
        },
        deleteBat( form ){
          form = $(form).get(0);
          for (var i = 0; i < form.elements.length; i++) {
            var e = form.elements[i];
            if( e.checked && e.value ){
              this.deleteItem( e.value );
            }
          }
          for (var i = 0; i < form.elements.length; i++) {
            var e = form.elements[i];
            e.checked = false;
          }
          this.list_len = this.list.length;
        },
        searchKeyword:function () {
          this.shop = this.$refs['shop'].value;
          this.keyword = this.$refs['keyword'].value;
        },
        toManageList:function () {
            chrome.tabs.create({
                url:chrome.extension.getURL('already_select_manage.html'),
                selected:true
            });
        },
        //点击抓取按钮
        toCatch:function (id,item) {
          var r = $.post('http://zdm.jiguo.com/admin/Product/InsertProductDraft',{
            catch_data:{
              'name':item.title,
              'detail':item.detail||'',
              'pic':item.pic||[],
              'cover':item.cover || item.pic[0],
              'url':item.url,
              'mall':item.mall,
              'shop':item.shop,
              'price':item.price,
              'mark_price':item.mark_price,
              'discount':item.discount,
            }
          },replayDate=>{
            if(replayDate.resultCode==0 || replayDate.resultCode==-2){
              var data = store.get('data') || [];
              data.forEach(function (_item,_index) {
                if(_item.id==id){
                  data[_index].included = 1;
                }else if(!data[_index].included){
                  data[_index].included = 0;
                }
              });
              store.set('data',data);
              this.list_len = data.length + Math.random();
              this.list = data;
              $.alert('收录成功');
            }else{
              $.alert(replayDate.errorMsg || '收录失败');
            }
          },'json');

          r.fail(function () {
            $.alert('请先登录后台',3000);
          });

        },
        showPic:function (id,item) {
            this.pic = item.pic;
            this.pic.length && setTimeout(function () {
                var o = $('#dowebok');
                new Viewer(o.get(0));
                o.find('img').first().trigger('click');
            });
        },

        showModelSpread(id,item){
          this.showModal = true;
          this.spread = item;
          if( !this.spread.cover ){
            this.spread.cover = this.spread.pic?this.spread.pic[0]:'';
          }
          if( !this.spread.discount && this.spread.mark_price && this.spread.price ){
            this.spread.discount = Number(this.spread.price / this.spread.mark_price * 10).toFixed(1);
          }else if(!this.spread.discount){
            this.spread.discount = 0;
          }
          if( this.spread.discount<=0 || this.spread.discount>=10 ){
            this.spread.discount = 0;
          }
          this.url = this.spread.url;

          var promise = new Promise((resolve)=>{
            $.get('http://zdm.jiguo.com/admin/index/setcps',{
              url:this.url
            },replayDate=>{
              if(this.url==replayDate || !replayDate){
                this.noCps = 'no-cps';
                resolve(replayDate);
              }else{
                this.noCps = 'ok-cps';
                this.url = replayDate;
                resolve(replayDate);
              }
            });

          }).then( _ =>{
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
              $.post('http://zdm.jiguo.com/admin/index/InsertPic',{
                pic:pic,
                discount:this.spread.discount
              },replayDate=>{
                if(replayDate.status==0){
                  this.url = replayDate.short_url;
                }
                resolve();
              },'json');

            });
          });

        },
      selectcheckbox(form) {
        form = $(form).get(0);
        for (var i = 0; i < form.elements.length; i++) {
          var e = form.elements[i];
          if (e.name != 'chkall' && e.disabled != true) e.checked = form.chkall.checked;
        }
      },
      download(){
          var _this = this;
        var o_offset = $(this.$refs['spread-download']).offset();
        var o_w_h = {
            h:$(this.$refs['spread-download']).height(),
            w:$(this.$refs['spread-download']).width()
        };

        chrome.tabs.captureVisibleTab(null, {
          format : "png",
          quality : 100
        }, function(data) {
          var image = new Image();
          image.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = o_w_h.w * window.devicePixelRatio;
            canvas.height = o_w_h.h * window.devicePixelRatio;
            var context = canvas.getContext("2d");
            context.drawImage(image,-(o_offset.left-$(window).scrollLeft()) * window.devicePixelRatio,-(o_offset.top-$(window).scrollTop()) * window.devicePixelRatio );

            var link = document.createElement('a');
            var time = new Date().getTime();
            link.download = "spread-"+time+".png";
            link.href = canvas.toDataURL();
            link.click();
            setTimeout(()=>{
              _this.showModal = false;
            })
          };
          image.src = data;
        });
      },
      //价格排序
      sortPrice(){
        this.sort_price_type_acs = !this.sort_price_type_acs;
        this.sort_curr = 'price';
      },
      //折扣排序
      sortDiscount(){
        this.sort_discount_type_acs = !this.sort_discount_type_acs;
        this.sort_curr = 'discount';

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
    },
  filters:{
    filterTime(addtime){
      var t = new Date(addtime);
      return t.getFullYear().toString().substr(2) + '-'+ (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
    },
  }
});


function keyWordRed(title,keyword){
  return title.replace(keyword,'<span class="spread-red">'+keyword+'</span>');
}
