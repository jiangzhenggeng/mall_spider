
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
            }
            if(!item.id) item.id = createId();
            return item;
        });
        var text = '';
        if( !hasArray && message.data.url && message.data.title ){
            data.unshift(message.data);
            store.set('data',  data );
            text = '添加成功';
        }else{
            text = message;
        }
        sendResponse({
            result:'ok',
            text:text
        });
    }else{
        sendResponse({result:'error'} );
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
chrome.contextMenus.create({
    "title": '采集设置',
    "contexts": ['all'],
    "onclick": function (info, tab) {
        chrome.tabs.create({
            url:chrome.extension.getURL('stting.html'),
            selected:true
        });
    }
});
