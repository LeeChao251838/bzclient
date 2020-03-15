cc.Class({
    extends: cc.Component,

    properties: {
        _year:null,
        _month:null,
        _nowYear:null,
        _nowMonth:null,
        _day:null,

        _topNode:null,
        _centerNode:null,
        _bottomNode:null,

        _yearNode:null,
        _monthNode:null,
    },

    // use this for initialization
    onLoad: function () {
        var date = new Date()
        this._nowYear = date.getFullYear();
        this._nowMonth = date.getMonth();
        this._year = date.getFullYear();
        this._month = date.getMonth();
        this._day = date.getDate();

        this._topNode = this.node.getChildByName("top");
        this._centerNode = this.node.getChildByName("center");
        this._bottomNode = this.node.getChildByName("bottom");
        
        //初始化年月
        this._yearNode = this._topNode.getChildByName("year").getComponent(cc.Label);
        this._yearNode.string = this._year + " 年";

        this._monthNode = this._topNode.getChildByName("month").getComponent(cc.Label);
        this._monthNode.string = (this._month + 1) + " 月";

        this.initDate();
                
        

        /**
         *  var date = new Date()
         *  
         *  // 获取年份
         *  var newyear = data.getFullYear()
         * 
         *  // 获取月份
         *  var newmonth = data.getMonth()
         * 
         *  // 获取今日日期
         *  var newday = data.getDate()
         * 
         *  // 获取今天星期几
         *  data.getDay()
         * 
         *  // 获取这月第一天星期几
         *  var s = new Date(newYear, newmonth, 1);
         *  firstday = s.getDay()
         */
    },

    //初始化日期
    initDate:function(){
        // 获取这月有多少天
        var currentDay = this.getMonthsDay(this._year, this._month);

        // 获取当月第一天星期几
        var firstDay = this.getMonthFirst(this._year, this._month);
                
        var lastMonth = (this._month - 1) >= 0 ? (this._month - 1) : 11;
        var lastDay = this.getMonthsDay(this._year, lastMonth);
        if(lastMonth == 11){
            lastDay = this.getMonthsDay(this._year - 1, lastMonth);
        }
        
        console.log("Date",currentDay,firstDay,lastMonth,lastDay);
        var newlastDay = lastDay;

        if(firstDay == 0){
            for(var i = 6; i >= 0; i--) {
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getComponent(cc.Button).interactable = false;
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("date").color = new cc.Color(236,236,236);
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("date").getComponent(cc.Label).string = newlastDay--;
            }
        }
        else{
            for(var i = firstDay - 1; i >= 0; i--) {
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getComponent(cc.Button).interactable = false;
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("date").color = new cc.Color(236,236,236);
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("date").getComponent(cc.Label).string = newlastDay--;
            }
        }
        

        // // cc.dd.log(`lastMonth:${lastMonth} newmonth:${newmonth} firstDay:${firstDay} currentDay:${currentDay} lastDay:${lastDay} `);

        //填充这个月时间
        var nowCurrentDay = 1;
        if(firstDay != 0){
            for (var i = firstDay; i <= 6; i++) {
                if (nowCurrentDay == this._day && this._month == this._nowMonth && this._year == this._nowYear) {
                    this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("now").active = true;
                }
                else{
                    this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("now").active = false;
                }
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getComponent(cc.Button).interactable = true;
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("date").color = new cc.Color(30,42,49);
                this._centerNode.getChildByName('title1').getChildByName(`item${i}`).getChildByName("date").getComponent(cc.Label).string = nowCurrentDay++;
            }
        }

        var num = 1;
        var number = 0;
        for(var i = nowCurrentDay; i <= currentDay; i++) {
            if ((i - nowCurrentDay) % 7 === 0) {
                num++;
                number = 0;
            }

            if (i == this._day && this._month == this._nowMonth && this._year == this._nowYear) {
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${number}`).getChildByName("now").active = true;
            }
            else{
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${number}`).getChildByName("now").active = false;
            }
            this._centerNode.getChildByName(`title${num}`).getChildByName(`item${number}`).getComponent(cc.Button).interactable = true;
            this._centerNode.getChildByName(`title${num}`).getChildByName(`item${number}`).getChildByName("date").color = new cc.Color(30,42,49);
            this._centerNode.getChildByName(`title${num}`).getChildByName(`item${number}`).getChildByName("date").getComponent(cc.Label).string = i;
            number++;
        }

        //填充下个月的时间
        var index = 1;
        if (number <= 6) {
            for (var i = number; i <= 6; i++) {
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getChildByName("now").active = false;
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getComponent(cc.Button).interactable = false;
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getChildByName("date").color = new cc.Color(236,236,236);
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getChildByName("date").getComponent(cc.Label).string = index++;
            }
        }

        if(num < 6){
            num += 1;
            for (var i = 0; i <= 6; i++) {
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getChildByName("now").active = false;
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getComponent(cc.Button).interactable = false;
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getChildByName("date").color = new cc.Color(236,236,236);
                this._centerNode.getChildByName(`title${num}`).getChildByName(`item${i}`).getChildByName("date").getComponent(cc.Label).string = index++;       
            }
        }
       
    },

    // 获取那年那月有多少天
    getMonthsDay(year, month) {
        var year = year;
        var month = month;
        //console.log("lMonth",month);
        if (arguments.length == 0) {
            var date = new Date();
            year = date.getFullYear();
            month = data.getMonth();
        }

        if (arguments.length == 1) {
            var date = new Date();
            month = data.getMonth();
        }
        
        var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
            monthDays[1] = 29;
        }
        console.log("Month",month);
        return monthDays[month];
    },

    // 获取这个月第一天星期几 
    getMonthFirst(year, month) {
        var year = year;
        var month = month;
        if (arguments.length == 0) {
            var date = new Date();
            year = date.getFullYear();
            month = data.getMonth();
        }

        if (arguments.length == 1) {
            var date = new Date();
            month = data.getMonth();
        }
        
        var newDate = new Date(year, month, 1);
        return newDate.getDay();
    },

    refreshSelect:function(){
        for(var i = 1; i < this._centerNode.childrenCount; i++){
            var title = this._centerNode.getChildByName("title" + i);
            for(var j = 0; j < title.childrenCount; j++){
                title.children[j].getChildByName("select").active = false;
            }
        }
    },

    onLastYear:function(){
        this._year -= 1;
        if(this._year <= 1){
            this._year = 1;
        }
        this._yearNode.string = this._year + " 年";
        this.initDate();
        this.refreshSelect();
    },

    onNextYear:function(){
        this._year += 1;
        this._yearNode.string = this._year + " 年";
        this.initDate();
        this.refreshSelect();
    },

    onLastMonth:function(){
        this._month -= 1;
        if(this._month <= 0){
            this._month = 0;
        }
        this._monthNode.string = (this._month + 1) + " 月";
        this.initDate();
        this.refreshSelect();
    },

    onNextMonth:function(event){
        console.log("OnNext",event);
        this._month = this._month + 1;
        if(this._month >= 11){
            this._month = 11;
        }
        this._monthNode.string = (this._month + 1) + " 月";
        this.initDate();
        this.refreshSelect();
    },

});
