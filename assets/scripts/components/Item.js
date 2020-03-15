cc.Class({
    extends: cc.Component,

    properties: {
        _index:0,
    },

    updateItem:function(index, data){
        this._index = index;
    },
});