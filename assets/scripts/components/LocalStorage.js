var LocalStorage = module.exports;

LocalStorage.setItem = function(key, value){
    let trueKey =LocalStorage.getTrueKey(key);
    cc.sys.localStorage.setItem(trueKey, value);
}

LocalStorage.removeItem = function(key){
    let trueKey = LocalStorage.getTrueKey(key);
    cc.sys.localStorage.removeItem(trueKey);
}

LocalStorage.getItem = function(key){
    let trueKey = LocalStorage.getTrueKey(key);
    let data = cc.sys.localStorage.getItem(trueKey);
    if(data != null && data != ""){
        return data;
    }
    else{
        LocalStorage.init();
        return  cc.sys.localStorage.getItem(trueKey);
    }
}

LocalStorage.clear = function(){
    cc.sys.localStorage.clear();
}

LocalStorage.init = function(){
    let key = "card_setting";
    let trueKey = LocalStorage.getTrueKey(key);
    let data = cc.sys.localStorage.getItem(trueKey);
    if(data == null || data == ""){
        LocalStorage.setItem(key, '{"card_front":2,"card_back":2,"background":3}');
    }
}

LocalStorage.getTrueKey = function(key){
    return key + "_" + cc.GAMEID;
}