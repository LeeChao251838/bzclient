var FilterWord = module.exports;
FilterWord.filterwordArr = null;

FilterWord.chkFilterWord = function(chatword){
    if(FilterWord.filterwordArr == null){
        FilterWord.filterwordArr = [];
        if(cc.fy.resMgr.filterword != null){
            FilterWord.filterwordArr = cc.fy.resMgr.filterword.split("|");
        }
    }
    for (var i = 0; i < FilterWord.filterwordArr.length; ++i) {
        if (chatword.indexOf(FilterWord.filterwordArr[i]) != -1 && FilterWord.filterwordArr[i].length > 0) {
            return true;
        }
    }
    return false;
}