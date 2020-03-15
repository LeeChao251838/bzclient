cc.Class({
    extends: cc.Component,

    properties: {
        nodRound:{
            // displayName:"游戏局数",
            tooltip:"游戏局数",
            default:[],
            type:cc.Node
        },
        nodRule:{
            // displayName:"游戏玩法",
            tooltip:"游戏玩法",
            default:[],
            type:cc.Node
        },
        nodCost:{
            // displayName:"付费方式",
            tooltip:"付费方式",
            default:[],
            type:cc.Node
        },
        nodBaseScore:{
            // displayName:"底分设置",
            tooltip:"底分设置",
            default:[],
            type:cc.Node
        },  
        nodPlayer:{
            // displayName:"游戏人数",
            tooltip:"游戏人数",
            default:[],
            type:cc.Node
        },

        nodGps:cc.Node,  //GPS限制，checkBox

        type:{
            // displayName:"游戏id",
            tooltip:"游戏id",
            default:0
        },
    },
});
