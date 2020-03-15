cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // addClickEvent:function(node,target,component,handler){
    //     // console.log(component + ":" + handler);
    //     var eventHandler = new cc.Component.EventHandler();
    //     eventHandler.target = target;
    //     eventHandler.component = component;
    //     eventHandler.handler = handler;

    //     var clickEvents = node.getComponent(cc.Button).clickEvents;
    //     clickEvents.push(eventHandler);
    // },
    
    addClickEvent:function(node,target,component,handler,customData){
        if(node == null){
            console.log("error addClickEvent node == null ");
            return;
        }
        let curButton = node.getComponent(cc.Button);
        if(curButton == null){
            console.log("error addClickEvent node getComponent cc.Button is null ");
            return;
        }
        console.log("addClickEvent " + component + ":" + handler);

        var clickEvents = curButton.clickEvents;
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
         if(customData!=null){
            eventHandler.customEventData =customData;
        }
        clickEvents.push(eventHandler);

        curButton.node.on('click', function(){
            if(cc.fy && cc.fy.audioMgr){
                cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
            }
        });
    },

    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    //截取字符串，包括中文
    //中文长度是两个字符
    //hasDot：true 字符串后面加...
    subStringCN:function(str, len, hasDot, backData)
    {
        var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if(str.match(regRule)){
            return str;
        }

        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex,"**").length;
        for(var i = 0;i < strLength;i++)
        {
            singleChar = str.charAt(i).toString();
            if(singleChar.match(chineseRegex) != null)
            {
                newLength += 2;
            }
            else
            {
                newLength++;
            }
            if(newLength > len)
            {
                break;
            }
            newStr += singleChar;
        }

        if(hasDot && strLength > len)
        {
            // newStr += "...";
        }
        if(backData){
            return {newString:newStr, oldString:str, isMore:strLength > len};
        }
        return newStr;
    },

    //补齐,temp可以是点、空格、句号
    subMatchLen:function(str,len,temp){
        var newstr=this.subStringCN(str,len);
        if(newstr.length<len){
            for(let i=newstr.length;i<len;i++){
                newstr += temp;
            }
        }
        return newstr;
    },

    //翻数转成倍数
    fanToBei:function(fan)
    {
        return (1 << fan);
    },

    timeToString:function(date,format) {
        var _date = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S+": date.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in _date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? _date[k] : ("00" + _date[k]).substr(("" + _date[k]).length));
            }
        }
        return format;
    },
	
	// 洗牌
    shuffle:function(array) {
        var _array = array.concat();
        for (var i = _array.length; i--; ) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = _array[i];
            _array[i] = _array[j];
            _array[j] = temp;
        }

        return _array;
    },

    // 浮点数保留位数
    // m 转换数字 n小数位数 isnit如果是整数则返回整数，不填则默认返回n位小数
    floatToFixed(num,n,isint)
    {
        if(num == null || isNaN(num)){
            num = 0;
        }
        // 整数就直接返回整数
        if(isint && Number.isInteger(num)){
            return num;
        }
        var _num = parseFloat(num);
        if(isNaN(_num))
        {
            _num = 0;
        }
        else
        {
            if(_num == 0){
                _num = 0;
            }else{
                _num = _num.toFixed(n);
            }
        }
        return _num;
    },

    // 检查麻将是否支持3D玩法
    check3D: function(cardSetting, id){      
        if(cc.fy.replayMgr.isReplay() == true){
            return false;
        }
        if (cardSetting != null && cardSetting.card_back != 2) {
            return false;
        }
        // 没有设置id  检查当前id
        if (id == null && cc.fy.gameNetMgr.conf) {
            id = cc.fy.gameNetMgr.conf.type;
        }
        //不设置 cardSetting == null 默认3D      
        return this.isOpen3D(id);
    },

    isOpen3D:function(id){
        if (id == null && cc.fy.gameNetMgr.conf) {
            id = cc.fy.gameNetMgr.conf.type;
        }
        for (let i = 0; i < cc.Game3DType.length; i++) {
            const element = cc.Game3DType[i];
            if (element == id) {
                return true;
            }
        }
        return false;
    },

    array_contain(array, obj){
        if(array == null){
            return false;
        }
        for (var i = 0; i < array.length; i++){
            if (array[i] == obj)    // 如果要求数据类型也一致，这里可使用恒等号===
                return true;
        }
        return false;
    },

    formatDuring(mss){
        var seconds = (mss % (1000 * 60)) / 1000;

        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        if (minutes == 0) {
            return  " 1分钟 ";
        }
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (hours == 0) {
            return  minutes + " 分钟 ";
        }
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        if (days == 0) {
            return hours + " 小时 " + minutes + " 分钟 ";
        }
        else if (days >= 7) {
            return "7天前";
        }
        else{
            return days + "天 " + hours + "小时 "
        }
        // return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
    },

    timetrans(date){
        var date = new Date(date);//如果date为13位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+"   "+h+m+s;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
