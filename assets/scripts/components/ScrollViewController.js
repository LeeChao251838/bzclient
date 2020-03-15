// export module Layout {		
//     /** !#en Enum for Layout type
//     !#zh 布局类型 */
//     export enum Type {			
//         NONE = 0,
//         HORIZONTAL = 0,
//         VERTICAL = 0,
//         GRID = 0,		
//     }	
// }
    
// /****************************************************
// * Layout
// *****************************************************/

// export module Layout {		
//     /** !#en Enum for Layout Resize Mode
//     !#zh 缩放模式 */
//     export enum ResizeMode {			
//         NONE = 0,
//         CONTAINER = 0,
//         CHILDREN = 0,		
//     }	
// }
    
// var AxisDirection = {			
//     HORIZONTAL = 0,
//     VERTICAL = 1,
// };
var AxisDirection = cc.Enum({
    HORIZONTAL : 0,
    VERTICAL : 1,
    GRID : 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Node
        },
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        spawnCount: {
            default: 0,
            tooltip: '实际创建的项数量',
        },
        spacingX: {
            default: 0,
            tooltip: '项之间的间隔X大小',
        },
        spacingY: {
            default: 0,
            tooltip: '项之间的间隔Y大小',
        },
        paddingTop: {
            default: 0,
            tooltip: '顶部偏移',
        },

        celCount: {
            default: 0,
            tooltip: '列',
        },

        axisDirection: {
            default: AxisDirection.VERTICAL,
            type:AxisDirection,
            tooltip: '1.HORIZONTAL 横向布局 \n 2.VERTICAL 垂直布局 \n 3.GRID 网格方式布局',
        },
        _data:null,
        _totalCount: 0,
    },

    // use this for initialization
    onLoad: function () {
    	this.content = this.scrollView.content;
        this.items = []; // 存储实际创建的项数组
        this.updateTimer = 0;  
        this.updateInterval = 0.2;
        // 使用这个变量来判断滚动操作是向上还是向下
        this.lastContentPosY = 0;
        this.lastContentPosX = 0;
        if(this.axisDirection == AxisDirection.VERTICAL){
            // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
            this.bufferZone = this.spawnCount * (this.itemTemplate.height + this.spacingY) / 2;
        }
        else if(this.axisDirection == AxisDirection.HORIZONTAL){
            this.bufferZone = this.spawnCount * (this.itemTemplate.width + this.spacingX) / 2;
        }
        else if(this.axisDirection == AxisDirection.GRID){
            this.bufferZone = Math.ceil(this.spawnCount / this.celCount) * (this.itemTemplate.height + this.spacingY) / 2;
        }
    },

    // 列表初始化
    initialize: function () {
        var data = this._data;
        // console.log("==>> scrollvireCtrl --> data: ", data);
        this.items = [];
        // this.content.removeAllChildren();
        var itchildren =this.content.children;
        this._totalCount = data.length;
        if(this.axisDirection == AxisDirection.VERTICAL){
            // 获取整个列表的高度
            this.content.height = this._totalCount * (this.itemTemplate.height + this.spacingY) + this.spacingY + this.paddingTop;
            var itemCount = data.length >= this.spawnCount ? this.spawnCount : data.length;
            for (let i = 0; i < itemCount; ++i) { // spawn items, we only need to do this once
                 let item =itchildren[i];
                if(item==null){
                    item=cc.instantiate(this.itemTemplate);
                    this.content.addChild(item);
                    this.items.push(item);
                } 
                item.active = true;
                // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
                item.setPosition(0, -item.height * (0.5 + i) - this.spacingY * (i + 1) - this.paddingTop);
                item.getComponent('Item').updateItem(i, data[i]);
                // item.getComponent("Item").updateItem(i, i);
               
            }
            
            for(let i=itemCount;i<this.content.childrenCount;i++){
                var item =itchildren[i];
                item.active=false;
            }
        }
        else  if(this.axisDirection == AxisDirection.HORIZONTAL){
            // 获取整个列表的高度
            this.content.width = this._totalCount * (this.itemTemplate.width + this.spacingX) + this.spacingX + this.paddingTop;
            var itemCount = data.length >= this.spawnCount ? this.spawnCount : data.length;
            for (let i = 0; i < itemCount; ++i) { // spawn items, we only need to do this once
                let item =itchildren[i];
                if(item==null){
                    item=cc.instantiate(this.itemTemplate);
                    this.content.addChild(item);
                    this.items.push(item);
                } 
                item.active = true;
                item.setPosition(item.width * (0.5 + i) + this.spacingX * (i + 1) + this.paddingTop, 0);
                item.getComponent('Item').updateItem(i, data[i]);
                
            }

            
            for(let i=itemCount;i<this.content.childrenCount;i++){
                var item =itchildren[i];
                item.active=false;
            }
        }
        else  if(this.axisDirection == AxisDirection.GRID){
            // 获取整个列表的高度
            this.content.height = Math.ceil(this._totalCount / this.celCount) * (this.itemTemplate.height + this.spacingY) + this.spacingY + this.paddingTop;
            var itemCount = data.length >= this.spawnCount ? this.spawnCount : data.length;
            for (let i = 0; i < itemCount; ++i) { // spawn items, we only need to do this once
                let item =itchildren[i];
                if(item==null){
                    item=cc.instantiate(this.itemTemplate);
                    this.content.addChild(item);
                    this.items.push(item);
                } 
                item.active = true;
                // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
                var xs = i % this.celCount;
                var ys = Math.floor(i / this.celCount);
                item.setPosition(item.width * (0.5 + xs) + this.spacingX * (xs + 1), -item.height * (0.5 + ys) - this.spacingY * (ys + 1) + this.paddingTop);
                item.getComponent('Item').updateItem(i, data[i]);
              
            }
             for(let i=itemCount;i<this.content.childrenCount;i++){
                var item =itchildren[i];
                item.active=false;
            }
        }
    },

    // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.items;
        if(this.axisDirection == AxisDirection.VERTICAL){
            // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
            let isDown = this.scrollView.content.y < this.lastContentPosY;
            // 实际创建项占了多高（即它们的高度累加）
            let offset = (this.itemTemplate.height + this.spacingY) * items.length;
            let newY = 0;

            // 遍历数组，更新item的位置和显示
            for (let i = 0; i < items.length; ++i) {
                let viewPos = this.getPositionInView(items[i]);
                if (isDown) {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y + offset;
                    // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                    // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y < -this.bufferZone && newY < 0) {
                        items[i].setPositionY(newY);
                        let item = items[i].getComponent('Item');
                        // let itemId = item.itemID - items.length; // update item id
                        var index = item._index - items.length;
                        var data = this._data[index];
                        // item.updateItem(i, itemId);
                        // item.updateItem(data.id, data.name, data.date, data.playTimes);
                        item.updateItem(index, data);
                    }
                } else {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y - offset;
                    // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                    // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                        items[i].setPositionY(newY);
                        let item = items[i].getComponent('Item');
                        // let itemId = item.itemID + items.length;
                        var index = item._index + items.length;
                        var data = this._data[index];
                        // console.log("cccccc --> length = " + items.length);
                        // console.log("xxxx --> itemID = " + item.itemID);
                        // item.updateItem(i, itemId);
                        // item.updateItem(data.id, data.name, data.date, data.playTimes);
                        item.updateItem(index, data);
                    }
                }
            }
        }
        else  if(this.axisDirection == AxisDirection.HORIZONTAL){
            // 如果当前content的x坐标小于上次记录值，则代表往右滚动，否则往左。
            let isRight = this.scrollView.content.x > this.lastContentPosX;
            // 实际创建项占了多高（即它们的高度累加）
            let offset = (this.itemTemplate.width + this.spacingX) * items.length;
            let newX = 0;
            // console.log("isRight = " + isRight);
            // 遍历数组，更新item的位置和显示
            for (let i = 0; i < items.length; ++i) {
                let viewPos = this.getPositionInView(items[i]);
                if (isRight) {
                    // 提前计算出该item的新的y坐标
                    newX = items[i].x - offset;
                    // 如果往右滚动时item已经超出缓冲矩形，且newX未超出content左边界，
                    // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.x > this.bufferZone && newX > 0) {
                        items[i].setPositionX(newX);
                        let item = items[i].getComponent('Item');
                        // let itemId = item.itemID - items.length; // update item id
                        var index = item._index - items.length;
                        var data = this._data[index];
                        // item.updateItem(i, itemId);
                        // item.updateItem(data.id, data.name, data.date, data.playTimes);
                        item.updateItem(index, data);
                    }
                } else {
                    // 提前计算出该item的新的y坐标
                    newX = items[i].x + offset;
                    // console.log("newX = " + newX);
                    // 如果往左滚动时item已经超出缓冲矩形，且newY未超出content右边界，
                    // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.x < -this.bufferZone && newX < this.content.width) {
                        items[i].setPositionX(newX);
                        let item = items[i].getComponent('Item');
                        // let itemId = item.itemID + items.length;
                        var index = item._index + items.length;
                        var data = this._data[index];
                        // console.log("cccccc --> length = " + items.length);
                        // console.log("xxxx --> itemID = " + item.itemID);
                        // item.updateItem(i, itemId);
                        // item.updateItem(data.id, data.name, data.date, data.playTimes);
                        item.updateItem(index, data);
                    }
                }
            }
        }
        else if(this.axisDirection == AxisDirection.GRID){
            // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
            let isDown = this.scrollView.content.y < this.lastContentPosY;
            // 实际创建项占了多高（即它们的高度累加）
            let offset = (this.itemTemplate.height + this.spacingY) * Math.floor(items.length / this.celCount);
            let newY = 0;
            // 遍历数组，更新item的位置和显示
            for (let i = 0; i < items.length; ++i) {
                let viewPos = this.getPositionInView(items[i]);
                if (isDown) {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y + offset;
                    // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                    // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y < -this.bufferZone && newY < 0) {
                        items[i].setPositionY(newY);
                        let item = items[i].getComponent('Item');
                        var index = item._index - items.length;
                        var data = this._data[index];
                        console.log("data = ", data);
                        console.log("item._index = ", item._index);
                        if(data){
                            items[i].active = true;
                            item.updateItem(index, data);
                        }
                        else{
                            item._index = index;
                            items[i].active = false;
                        }
                        
                    }
                } else {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y - offset;
                    // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                    // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                        items[i].setPositionY(newY);
                        let item = items[i].getComponent('Item');
                        var index = item._index + items.length;
                        var data = this._data[index];
                        if(data){
                            items[i].active = true;
                            item.updateItem(index, data);
                        }
                        else{
                            item._index = index;
                            items[i].active = false;
                        }
                    }
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
        this.lastContentPosX = this.scrollView.content.x;
    },

    setData:function(listData){
        this._data = listData;
        this.initialize();
    },

    getItem:function(index){
        if(this.items && this.items.length > index){
            return this.items[index].getComponent('Item');
        }
        return null;
    },
    getItems:function(){
        var _items = [];
        for(var i=0;i<this.items.length;i++){
            _items.push(this.items[i].getComponent('Item'));
        }
        return _items;
    },
    getItemData:function(index){
        return this._data[index];
    },
});
