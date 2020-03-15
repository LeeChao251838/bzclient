var FilterWord = require("FilterWord");
var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        editBoxName:cc.EditBox,
        editBoxID:cc.EditBox,
        // editBoxTel:cc.EditBox,// 手机
        // editBoxCode:cc.EditBox,// 手机验证码
        // btnSendCode:cc.Node,// 发送验证码控件
        btnSure:cc.Button,
        
        _tel: null,// 用于点击验证码后存入 反正修改验证
    },

    onLoad(){
        this.initView();
        this.initEventHandlers();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWREALNAMEVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWREALNAMEVIEW_CTC ---- ");
                self.show();
            }
        });
    },

    initView(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
    },

    show(){

        this.node.active = true;
    },

    close(){
        this.node.active = false;
    },

    onButtonSure(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var self = this;
        var name = this.editBoxName.string;
        var identityCode = this.editBoxID.string;
        console.log("==>> onButtonSure --> name = " + name);
        console.log("==>> onButtonSure --> identityCode = " + identityCode);
        var isNameValid = this.nameValid(name);
        var isIDValid = this.identityCodeValid(identityCode);
        // if (FilterWord.chkFilterWord(name)) {
        //     cc.fy.hintBox.show("名字不能包含敏感词");
        //     return;
        // }
        if(!isNameValid){
            cc.fy.hintBox.show("真实姓名填写有误！");
            return;
        }
        if(!isIDValid){
            cc.fy.hintBox.show("身份证号填写有误！");
            return;
        }
        // if(this._tel == null){
        //     cc.fy.hintBox.show("信息填写有误!");
        //     return;
        // }
        // if(this._tel != null && this._tel != this.editBoxTel.string){
        //     cc.fy.hintBox.show("手机号码已修改请重新认证!");
        //     this._tel = null;
        //     return;
        // }

        // 和服务器请求 用户id 用户姓名 用户身份证 用户手机号码 用户验证码
        cc.fy.http.sendRequest('/certification_new', { userId: cc.fy.userMgr.userId, name: name, id: identityCode}, function(data){
            if(data.errcode == 0){
                cc.fy.hintBox.show("实名认证成功！");
                var json = {uid: cc.fy.userMgr.userId};
                cc.fy.localStorage.setItem("realname", JSON.stringify(json));
                if(cc.fy.hall != null){// 此处加个判断防止有些客户端没有增加脚本引用或者函数导致报错
                    cc.fy.hall.refreshInfo();// 刷新个人信息
                    cc.fy.hall.refreshGemsTip();// 刷新房卡
                }else{
                    cc.warn("这里有些东西缺少了。自己补充吧");
                }
                self.close();
            }else{
                cc.fy.hintBox.show(data.errmsg);
            }
        });
    },

    // 姓名简单验证
    nameValid(name){
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        if(!regName.test(name)){
            console.log("==>> 真实姓名填写有误");
            return false;
        }
        return true;
    },

    // 身份证号合法性验证
    identityCodeValid(code){ 
        var city = {
            11 : "北京",
            12 : "天津",
            13 : "河北",
            14 : "山西",
            15 : "内蒙古",
            21 : "辽宁",
            22 : "吉林",
            23 : "黑龙江",
            31 : "上海",
            32 : "江苏",
            33 : "浙江",
            34 : "安徽",
            35 : "福建",
            36 : "江西",
            37 : "山东",
            41 : "河南",
            42 : "湖北",
            43 : "湖南",
            44 : "广东",
            45 : "广西",
            46 : "海南",
            50 : "重庆",
            51 : "四川",
            52 : "贵州",
            53 : "云南",
            54 : "西藏",
            61 : "陕西",
            62 : "甘肃",
            63 : "青海",
            64 : "宁夏",
            65 : "新疆",
            71 : "台湾",
            81 : "香港",
            82 : "澳门",
            91 : "国外",
        };

        var tip = "";
        var pass = true;
        
        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        }
        else if(!city[code.substr(0, 2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass = false;
                }
            }
        }
        if(!pass) console.log("==>> identityCodeValid --> tip: " + tip);
        return pass;
    },

    // 发送验证码请求
    requestCode(){
        var self = this;
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
        // if(!myreg.test(this.editBoxTel.string)) {  
        //     cc.fy.hintBox.show("手机号码填写有误！");
        //     return;
        // }
        // self._tel = self.editBoxTel.string;// 这里赋值， 提交再次对比
        // self.btnSendCode.getComponent(cc.Button).interactable = false;// 禁用按钮        
        // cc.fy.http.sendRequest('/get_sms_code', {userId:cc.fy.userMgr.userId, phone:parseInt(self._tel)}, function(data){
        //     if(data.errcode == 0){
        //         var rt = self.btnSendCode.getComponent(cc.RichText);// 获取富文本组件
        //         var sec = 60;// 倒计时 60s
        //         self.schedule(function(){
        //             if(sec <= 0){
        //                 self.btnSendCode.getComponent(cc.Button).interactable = true;// 启用按钮
        //                 rt.string = "<u>发送验证码</u>";
        //                 return;
        //             }
        //             rt.string = "" + sec-- + "秒后重新发送";
        //         }, 1, 61, 0);
        //     }
        //     else{
        //         cc.fy.hintBox.show(data.errmsg);
        //         self.btnSendCode.getComponent(cc.Button).interactable = true;// 启用按钮
        //     }
        // });
    }, 
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});
