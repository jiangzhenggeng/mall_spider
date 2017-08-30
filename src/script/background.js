
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
