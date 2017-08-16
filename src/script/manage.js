


var app = new Vue({
    el: '#app',
    data: {
        list: (function () {
            return store.get('data') || [];
        })(),
        shop:'',
        keyword:'',
        popup: window.location.href.split('?')[1]=='popup',
        pic:[]
    },
    methods:{
        deleteItem:function (id,item) {

            var index = -1,data = this.list;
            data.forEach(function (_item,_index) {
               if(_item.id==id) index = _index;
            });
            if(index>-1){
                this.list.splice(index,1);
                store.set('data',this.list);
            }
        },
        searchKeyword:function () {
            var shop = $('[name="shop"]').val();
            var keyword = $('[name="keyword"]').val();
            var data = store.get('data')||[];
            data = data.filter(function (item) {
                if(shop && item.shop!=shop) return false;
                return true;
            });
            this.list = data.filter(function (item) {
                if(keyword && item.title.indexOf(keyword)==-1) return false;
                return true;
            });
        },
        toManageList:function () {
            chrome.tabs.create({
                url:chrome.extension.getURL('already_select_manage.html'),
                selected:true
            });
        },
        //点击抓取按钮
        toCatch:function (id,item) {
            $.alert('未实现');
        },
        showPic:function (pic) {
            this.pic = pic;
            this.pic.length && setTimeout(function () {
                var o = $('#dowebok');
                new Viewer(o.get(0));
                o.find('img').first().trigger('click');
            });
        }
    }
});