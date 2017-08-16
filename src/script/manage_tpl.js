
var VUE_TPL = {
    MANAGE:`
        <div class="search">
        <form class="form-inline">
            <div class="form-group">
                <label class="control-label">电商</label>
                <select name="shop" class="form-control">
                    <option value="">请选择</option>
                    <option value="tmall">天猫</option>
                    <option value="taobao">淘宝</option>
                    <option value="jd">京东</option>
                    <option value="amazon">亚马逊</option>
                    <option value="suning">苏宁</option>
                </select>
            </div>
            <div class="form-group">
                <label class="control-label">关键词</label>
                <input name="keyword" type="text" class="form-control" placeholder="关键词">
            </div>
            <button @click="searchKeyword" type="button" class="btn btn-default">搜索</button>
            <a href="#" class="fr">管理</a>
        </form>
    </div>
    <div class="">
        <table class="table table-hover">
            <tr>
                <th width="25%">商品</th>
                <th width="12%">电商价</th>
                <th width="12%">市场价</th>
                <th width="12%">折扣</th>
                <th width="12%">图片</th>
                <th width="12%">详细</th>
                <th width="15%">操作</th>
            </tr>
            <tr v-for="item in list">
                <td>
                    <div class="title">{{list}}
                        <a :href="item.url" target="_blank">{{ item.title }}</a>
                    </div>
                </td>
                <td>¥{{ item.price }}</td>
                <td>{{ item.mark_price?'¥'+item.mark_price:'' }}</td>
                <td>{{ item.discount }}</td>
                <td>{{ item.pic?'有':'无' }}</td>
                <td>{{ item.detail?'有':'无' }}</td>
                <td>
                    {{ item.catch?'抓取':'已抓取' }} |
                    <a href="#" @click="deleteItem(item.id,item)">删除</a>
                </td>
            </tr>
        </table>
    </div>
    `,
}










