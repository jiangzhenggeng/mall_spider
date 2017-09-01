
function createId() {
    return 'id-'+(Math.random().toString().replace('.',''));
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    //采集事件
    if(message.type=='get-item-html'){
        message.data.id = createId();
        var data = store.get('data')||[], hasArray = false;
        data.map(function (item) {
            if(
                item.url == message.data.url ||
                item.title == message.data.title
            ){
                hasArray = true;

              if( message.data.pic ){
                  item.pic = message.data.pic;
              }
              if( message.data.detail ){
                item.detail = message.data.detail;
              }
              if( message.data.cover ){
                item.cover = message.data.cover;
              }
              if( message.data.discount ){
                item.discount = message.data.discount;
              }
              if( message.data.price ){
                item.price = message.data.price;
              }
              if( message.data.mark_price ){
                item.mark_price = message.data.mark_price;
              }

              item.updatetime = new Date().getTime();

            }
            if(!item.id) item.id = createId();


          if(!item.addtime) item.addtime = new Date().getTime();
          if(!item.updatetime) item.updatetime = new Date().getTime();

          item.price = (item.price||'').replace(/\.0+$/g,'');
          item.mark_price = (item.mark_price||'').replace(/\.0+$/g,'');

            return item;
        });
        var text = '';
        if( !hasArray && message.data.url && message.data.title ){
          message.data.updatetime = message.data.addtime = new Date().getTime();
            data.unshift(message.data);
            text = '添加成功';
        }else{
            text = message;
        }
        store.set('data',  data );

        sendMessageToContentScript && sendMessageToContentScript({
          type:'set-store',
          storeData:store.get('data')
        });

        sendResponse({
            result:'ok',
            text:text
        });


        var item = message.data;
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

    }
});

chrome.contextMenus.create({
    "title": '管理列表',
    "contexts": ['all'],
    "onclick": function (info, tab) {
        chrome.tabs.create({
            url:chrome.extension.getURL('already_select_manage.html'),
            selected:true
        });
    }
});
