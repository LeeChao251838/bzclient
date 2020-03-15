/**
 * 屏蔽多个按钮同时点击
 */
let nowClickID = null;
cc.Button.prototype._onTouchEnded = function (event) {
    if (!this.interactable || !this.enabledInHierarchy) return;
    if (nowClickID != null && nowClickID != this.node.uuid) return;
    if (this._pressed) {
        cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        this.node.emit('click', this);

    }
    nowClickID = null;

    this._pressed = false;
    this._updateState();
    event.stopPropagation();
}

cc.Button.prototype._onTouchCancel = function () {
    if (!this.interactable || !this.enabledInHierarchy) return;
    nowClickID = null;
    this._pressed = false;
    this._updateState();
}


// touch event handler
cc.Button.prototype._onTouchBegan = function (event) {
    if (!this.interactable || !this.enabledInHierarchy) return;
    if (nowClickID == null) { nowClickID = this.node.uuid; }
    if (nowClickID != this.node.uuid) {
        nowClickID = this.node.uuid;
        console.log('----->>>>>>>>>>'); 
        return;
    }
    this._pressed = true;
    this._updateState();
    event.stopPropagation();


}
cc.Button.prototype.onDisable = function () {
    this._hovered = false;
    this._pressed = false;

    if (!CC_EDITOR) {
        if (this.node.uuid == nowClickID) {
            nowClickID = null;
        }

        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    } else {
        this.node.off('spriteframe-changed');
    }
}