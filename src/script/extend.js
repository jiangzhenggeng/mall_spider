

My$.extend({
    parseUrl:function(url) {
        var parse_url_result = {};
        var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        var result = parse_url.exec(url);
        result && ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'].forEach(function(item, i){
            parse_url_result[item] = result[i]
        });
        return parse_url_result;
    },
    alert:function (msg) {
        if(chrome && chrome.notifications){
          chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'images/message.png',
            title: '消息',
            message: msg
          },id=>{
            setTimeout(()=>{
              chrome.notifications.clear(id, function(){});
            }, 1000);
          });
        }else{
          alert(msg);
        }
    },
    trim:function(string) {
        return String(string||'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
    },
    priceFn:function (string){
        return String(string||'').split('-')[0].replace(/[^\d\.]/g,'');
    },
    extendUrl:function (url){
        return url.substr(0,2)=='//'?'http:'+url:url;
    },
  pluginsPath:(function () {
        return chrome.extension.getURL('');
      })()
});



