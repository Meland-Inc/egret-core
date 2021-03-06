//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


namespace egret {
    /**
     * ScrollView auxiliary classes for slides, you will pass a display object constructor. It can display more than the range display object within the specified size range. And can easily drag in this range.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/ScrollView.ts
     * @language en_US
     */
    /**
     * ScrollView ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/ScrollView.ts
     * @language zh_CN
     */
    export class ScrollView extends DisplayObjectContainer {

        /**
         * @private
         */
        public _ScrV_Props_: ScrollViewProperties;

        /**
         * Start rolling threshold when the touch point from the initial touch point at a distance exceeding this value will trigger roll
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ??????????????????????????????????????????????????????????????????????????????????????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public scrollBeginThreshold: number = 10;


        /**
         * Scrolling speed, the speed is required and the default speed ratio.
         * The range of scrollSpeed> 0 assigned to 2:00, the speed is 2 times the default speed
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????????????????????????????????????????????????????
         * ??????????????? scrollSpeed > 0 ????????? 2 ?????????????????????????????? 2 ???
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public scrollSpeed: number = 1;


        /**
         * Whether to enable rebound, rebound When enabled, ScrollView contents allowed to continue to drag the border after arriving at the end user drag operation, and then bounce back boundary position
         * @default true
         * @version Egret 2.4
         * @language en_US
         */
        /**
         * ??????????????????????????????????????????ScrollView?????????????????????????????????????????????????????????????????????????????????????????????????????????
         * @default true
         * @version Egret 2.4
         * @language zh_CN
         */
        public get bounces(): boolean {
            return this._ScrV_Props_._bounces;
        }

        public set bounces(value: boolean) {
            this._ScrV_Props_._bounces = !!value;
        }

        /**
         * Create a egret.ScrollView objects
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ???????????? egret.ScrollView ??????
         * @param content {egret.DisplayObject} ?????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        constructor(content: DisplayObject = null) {
            super();
            this.touchEnabled = true;
            this._ScrV_Props_ = new egret.ScrollViewProperties();
            if (content) {
                this.setContent(content);
            }
        }

        /**
         * @private
         */
        public _content: DisplayObject = null;

        /**
         * Set to scroll object
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ???????????????????????????
         * @param content {egret.DisplayObject} ?????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public setContent(content: DisplayObject): void {
            if (this._content === content)
                return;
            this.removeContent();
            if (content) {
                this._content = content;
                super.addChild(content);
                this._addEvents();
            }
        }

        /**
         * Remove rolling objects
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public removeContent(): void {
            if (this._content) {
                this._removeEvents();
                super.removeChildAt(0);
            }
            this._content = null;
        }

        /**
         * Vertical scroll bar display policy, on / off / auto.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ??????????????????????????????on/off/auto???
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get verticalScrollPolicy(): string {
            return this._ScrV_Props_._verticalScrollPolicy;
        }

        public set verticalScrollPolicy(value: string) {
            if (value == this._ScrV_Props_._verticalScrollPolicy)
                return;
            this._ScrV_Props_._verticalScrollPolicy = value;
        }


        /**
         * The horizontal scroll bar display policy, on / off / auto.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ??????????????????????????????on/off/auto???
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get horizontalScrollPolicy(): string {
            return this._ScrV_Props_._horizontalScrollPolicy;
        }

        public set horizontalScrollPolicy(value: string) {
            if (value == this._ScrV_Props_._horizontalScrollPolicy)
                return;
            this._ScrV_Props_._horizontalScrollPolicy = value;
        }

        /**
         * Gets or sets the horizontal scroll position
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????????????????,
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get scrollLeft(): number {
            return this._ScrV_Props_._scrollLeft;
        }

        public set scrollLeft(value: number) {
            if (value == this._ScrV_Props_._scrollLeft)
                return;
            this._ScrV_Props_._scrollLeft = value;
            this._validatePosition(false, true);
            this._updateContentPosition();
        }

        /**
         * Gets or sets the vertical scroll position
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????????????????,
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get scrollTop(): number {
            return this._ScrV_Props_._scrollTop;
        }

        public set scrollTop(value: number) {
            if (value == this._ScrV_Props_._scrollTop)
                return;
            this._ScrV_Props_._scrollTop = value;
            this._validatePosition(true, false);
            this._updateContentPosition();
        }

        /**
         * Set scroll position
         * @param top {number} The vertical scroll position
         * @param left {number} The horizontal scroll position
         * @param isOffset {boolean} Optional parameter, the default is false, whether it is the amount of scrolling increase as top = 1 on behalf of one pixel scroll up
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ??????????????????
         * @param top {number} ??????????????????
         * @param left {number} ??????????????????
         * @param isOffset {boolean} ????????????????????????false????????????????????????????????? top=1 ??????????????????1??????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public setScrollPosition(top: number, left: number, isOffset: boolean = false): void {
            if (isOffset && top == 0 && left == 0)
                return;
            if (!isOffset && this._ScrV_Props_._scrollTop == top
                && this._ScrV_Props_._scrollLeft == left)
                return;
            let oldTop = this._ScrV_Props_._scrollTop,
                oldLeft = this._ScrV_Props_._scrollLeft;
            if (isOffset) {
                let maxLeft = this.getMaxScrollLeft();
                let maxTop = this.getMaxScrollTop();
                if (oldTop <= 0 || oldTop >= maxTop) {
                    top = top / 2;
                }
                if (oldLeft <= 0 || oldLeft >= maxLeft) {
                    left = left / 2;
                }
                let newTop = oldTop + top;
                let newLeft = oldLeft + left;

                //??????????????????
                let bounces = this._ScrV_Props_._bounces;
                if (!bounces) {
                    if (newTop <= 0 || newTop >= maxTop)
                        newTop = Math.max(0, Math.min(newTop, maxTop));
                    if (newLeft <= 0 || newLeft >= maxLeft)
                        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                }
                this._ScrV_Props_._scrollTop = newTop;
                this._ScrV_Props_._scrollLeft = newLeft;
            }
            else {
                this._ScrV_Props_._scrollTop = top;
                this._ScrV_Props_._scrollLeft = left;
            }
            this._validatePosition(true, true);
            this._updateContentPosition();
        }

        /**
         * @private
         *
         * @param top
         * @param left
         */
        private _validatePosition(top = false, left = false): void {
            if (top) {
                let height = this.height;
                let contentHeight = this._getContentHeight();
                this._ScrV_Props_._scrollTop = Math.max(this._ScrV_Props_._scrollTop, (0 - height) / 2);
                this._ScrV_Props_._scrollTop = Math.min(this._ScrV_Props_._scrollTop, contentHeight > height ? (contentHeight - height / 2) : height / 2);
            }
            if (left) {
                let width = this.width;
                let contentWidth = this._getContentWidth();
                this._ScrV_Props_._scrollLeft = Math.max(this._ScrV_Props_._scrollLeft, (0 - width) / 2);
                this._ScrV_Props_._scrollLeft = Math.min(this._ScrV_Props_._scrollLeft, contentWidth > width ? (contentWidth - width / 2) : width / 2);
            }
        }

        /**
         * @private
         * @inheritDoc
         */
        $setWidth(value: number): void {
            if (this.$explicitWidth == value) {
                return;
            }
            super.$setWidth(value);
            this._updateContentPosition();
        }

        /**
         * @private
         * @inheritDoc
         */
        $setHeight(value: number): void {
            if (this.$explicitHeight == value) {
                return;
            }
            super.$setHeight(value);
            this._updateContentPosition();
        }

        /**
         * @private
         *
         */
        public _updateContentPosition(): void {
            let height = this.height;
            let width = this.width;
            //??????????????????????????????????????????????????????????????????????????????
            this.scrollRect = new Rectangle(Math.round(this._ScrV_Props_._scrollLeft), Math.round(this._ScrV_Props_._scrollTop), width, height);
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        /**
         * @private
         *
         * @returns
         */
        public _checkScrollPolicy(): boolean {
            let hpolicy = this._ScrV_Props_._horizontalScrollPolicy;
            let hCanScroll = this.__checkScrollPolicy(hpolicy, this._getContentWidth(), this.width);
            this._ScrV_Props_._hCanScroll = hCanScroll;
            let vpolicy = this._ScrV_Props_._verticalScrollPolicy;
            let vCanScroll = this.__checkScrollPolicy(vpolicy, this._getContentHeight(), this.height);
            this._ScrV_Props_._vCanScroll = vCanScroll;
            return hCanScroll || vCanScroll;
        }

        /**
         * @private
         *
         * @param policy
         * @param contentLength
         * @param viewLength
         * @returns
         */
        private __checkScrollPolicy(policy: string, contentLength, viewLength): boolean {
            if (policy == "on")
                return true;
            if (policy == "off")
                return false;
            return contentLength > viewLength;
        }


        /**
         * @private
         *
         * @returns
         */
        public _addEvents(): void {
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.addEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        /**
         * @private
         *
         * @returns
         */
        public _removeEvents(): void {
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, true);
            this.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEndCapture, this, true);
        }

        private _tempStage: Stage;
        /**
         * @private
         *
         * @param e
         */
        public _onTouchBegin(e: TouchEvent): void {
            if (e.$isDefaultPrevented) {
                return;
            }
            let canScroll: boolean = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            this._ScrV_Props_._touchStartPosition.x = e.stageX;
            this._ScrV_Props_._touchStartPosition.y = e.stageY;
            if (this._ScrV_Props_._isHTweenPlaying || this._ScrV_Props_._isVTweenPlaying) {
                this._onScrollFinished();
            }
            this._tempStage = this.stage;
            this._tempStage.addEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._tempStage.addEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._tempStage.addEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.addEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);

            this._logTouchEvent(e);
            e.preventDefault();
        }

        /**
         * @private
         */
        private delayTouchBeginEvent: TouchEvent = null;
        /**
         * @private
         */
        private touchBeginTimer: Timer = null;

        /**
         * @private
         *
         * @param event
         */
        public _onTouchBeginCapture(event: TouchEvent): void {
            let canScroll: boolean = this._checkScrollPolicy();
            if (!canScroll) {
                return;
            }

            let target: DisplayObject = event.target;
            while (target != this) {
                if ("_checkScrollPolicy" in target) {
                    canScroll = (<ScrollView><any>target)._checkScrollPolicy();
                    if (canScroll) {
                        return;
                    }
                }
                target = target.parent;
            }
            event.stopPropagation();
            let evt: TouchEvent = this.cloneTouchEvent(event);
            this.delayTouchBeginEvent = evt;
            if (!this.touchBeginTimer) {
                this.touchBeginTimer = new egret.Timer(100, 1);
                this.touchBeginTimer.addEventListener(TimerEvent.TIMER_COMPLETE, this._onTouchBeginTimer, this);
            }
            this.touchBeginTimer.start();
            this._onTouchBegin(event);
        }

        /**
         * @private
         *
         * @param event
         * @returns
         */
        private _onTouchEndCapture(event: TouchEvent): void {
            if (!this.delayTouchBeginEvent) {
                return;
            }
            this._onTouchBeginTimer();
            event.stopPropagation();
            let evt: TouchEvent = this.cloneTouchEvent(event);
            egret.callLater(() => {
                if (this.stage) {
                    this.dispatchPropagationEvent(evt);
                }
            }, this);
        }

        /**
         * @private
         *
         */
        private _onTouchBeginTimer(): void {
            this.touchBeginTimer.stop();
            let event: TouchEvent = this.delayTouchBeginEvent;
            this.delayTouchBeginEvent = null;
            //Dispatch event only if the scroll view is still on the stage
            if (this.stage)
                this.dispatchPropagationEvent(event);
        }

        /**
         * @private
         *
         * @param event
         * @returns
         */
        private dispatchPropagationEvent(event: TouchEvent): void {
            let target: egret.DisplayObject = event.$target;
            let list = this.$getPropagationList(target);
            let length = list.length;
            let targetIndex = list.length * 0.5;
            let startIndex = -1;
            for (let i = 0; i < length; i++) {
                if (list[i] === this._content) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, startIndex + 1);
            targetIndex -= startIndex + 1;
            this.$dispatchPropagationEvent(event, list, targetIndex);
            egret.Event.release(event);
        }

        /**
         * @private
         *
         * @param event
         * @returns
         */
        public _onTouchMove(event: TouchEvent): void {
            if (this._ScrV_Props_._lastTouchPosition.x == event.stageX && this._ScrV_Props_._lastTouchPosition.y == event.stageY)
                return;
            if (!this._ScrV_Props_._scrollStarted) {
                let x = event.stageX - this._ScrV_Props_._touchStartPosition.x,
                    y = event.stageY - this._ScrV_Props_._touchStartPosition.y;
                let distance = Math.sqrt(x * x + y * y);
                if (distance < this.scrollBeginThreshold) {
                    this._logTouchEvent(event);
                    return;
                }
            }
            this._ScrV_Props_._scrollStarted = true;
            if (this.delayTouchBeginEvent) {
                this.delayTouchBeginEvent = null;
                this.touchBeginTimer.stop();
            }
            this.touchChildren = false;
            let offset = this._getPointChange(event);
            this.setScrollPosition(offset.y, offset.x, true);
            this._calcVelocitys(event);
            this._logTouchEvent(event);
        }

        /**
         * @private
         *
         * @param event
         * @returns
         */
        public _onTouchEnd(event: TouchEvent): void {
            this.touchChildren = true;
            this._ScrV_Props_._scrollStarted = false;
            this._tempStage.removeEventListener(TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._tempStage.removeEventListener(TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._tempStage.removeEventListener(TouchEvent.LEAVE_STAGE, this._onTouchEnd, this);
            this.removeEventListener(Event.ENTER_FRAME, this._onEnterFrame, this);

            this._moveAfterTouchEnd();
        }


        /**
         * @private
         *
         * @param event
         * @returns
         */
        public _onEnterFrame(event: Event): void {
            let time = getTimer();
            if (time - this._ScrV_Props_._lastTouchTime > 100 && time - this._ScrV_Props_._lastTouchTime < 300) {
                this._calcVelocitys(this._ScrV_Props_._lastTouchEvent);
            }
        }

        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _logTouchEvent(e: TouchEvent): void {
            this._ScrV_Props_._lastTouchPosition.x = e.stageX;
            this._ScrV_Props_._lastTouchPosition.y = e.stageY;
            this._ScrV_Props_._lastTouchEvent = this.cloneTouchEvent(e);
            this._ScrV_Props_._lastTouchTime = egret.getTimer();
        }

        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _getPointChange(e: TouchEvent): { x: number; y: number } {
            return {
                x: this._ScrV_Props_._hCanScroll === false ? 0 : (this._ScrV_Props_._lastTouchPosition.x - e.stageX),
                y: this._ScrV_Props_._vCanScroll === false ? 0 : (this._ScrV_Props_._lastTouchPosition.y - e.stageY)
            };
        }

        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _calcVelocitys(e: TouchEvent): void {
            let time = getTimer();
            if (this._ScrV_Props_._lastTouchTime == 0) {
                this._ScrV_Props_._lastTouchTime = time;
                return;
            }
            let change = this._getPointChange(e);
            let timeoffset = time - this._ScrV_Props_._lastTouchTime;
            change.x /= timeoffset;
            change.y /= timeoffset;
            this._ScrV_Props_._velocitys.push(change);
            if (this._ScrV_Props_._velocitys.length > 5)
                this._ScrV_Props_._velocitys.shift();
            this._ScrV_Props_._lastTouchPosition.x = e.stageX;
            this._ScrV_Props_._lastTouchPosition.y = e.stageY;
        }

        /**
         * @private
         *
         * @returns
         */
        public _getContentWidth(): number {
            return this._content.$explicitWidth || this._content.width;
        }

        /**
         * @private
         *
         * @returns
         */
        public _getContentHeight(): number {
            return this._content.$explicitHeight || this._content.height;
        }

        /**
         * The left side of the maximum distance
         * @returns The left side of the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ????????????????????????
         * @returns ?????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public getMaxScrollLeft(): number {
            let max = this._getContentWidth() - this.width;
            return Math.max(0, max);
        }

        /**
         * Above the maximum distance
         * @returns Above the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????
         * @returns ?????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public getMaxScrollTop(): number {
            let max = this._getContentHeight() - this.height;
            return Math.max(0, max);
        }

        /**
         * @private
         */
        private static weight = [1, 1.33, 1.66, 2, 2.33];

        /**
         * @private
         *
         */
        private _moveAfterTouchEnd(): void {
            if (this._ScrV_Props_._velocitys.length == 0)
                return;
            let sum = { x: 0, y: 0 }, totalW = 0;
            for (let i = 0; i < this._ScrV_Props_._velocitys.length; i++) {
                let v = this._ScrV_Props_._velocitys[i];
                let w = ScrollView.weight[i];
                sum.x += v.x * w;
                sum.y += v.y * w;
                totalW += w;
            }
            this._ScrV_Props_._velocitys.length = 0;

            if (this.scrollSpeed <= 0)
                this.scrollSpeed = 1;
            let x = sum.x / totalW * this.scrollSpeed, y = sum.y / totalW * this.scrollSpeed;
            let pixelsPerMSX = Math.abs(x), pixelsPerMSY = Math.abs(y);
            let maxLeft = this.getMaxScrollLeft();
            let maxTop = this.getMaxScrollTop();
            let datax = pixelsPerMSX > 0.02 ? this.getAnimationDatas(x, this._ScrV_Props_._scrollLeft, maxLeft) : {
                position: this._ScrV_Props_._scrollLeft,
                duration: 1
            };
            let datay = pixelsPerMSY > 0.02 ? this.getAnimationDatas(y, this._ScrV_Props_._scrollTop, maxTop) : {
                position: this._ScrV_Props_._scrollTop,
                duration: 1
            };
            this.setScrollLeft(datax.position, datax.duration);
            this.setScrollTop(datay.position, datay.duration);
        }

        /**
         * @private
         *
         * @param tw
         */
        private onTweenFinished(tw: ScrollTween) {
            if (tw == this._ScrV_Props_._vScrollTween)
                this._ScrV_Props_._isVTweenPlaying = false;
            if (tw == this._ScrV_Props_._hScrollTween)
                this._ScrV_Props_._isHTweenPlaying = false;
            if (this._ScrV_Props_._isHTweenPlaying == false && this._ScrV_Props_._isVTweenPlaying == false) {
                this._onScrollFinished();
            }
        }

        /**
         * @private
         *
         * @returns
         */
        public _onScrollStarted(): void {

        }

        /**
         * @private
         *
         * @returns
         */
        public _onScrollFinished(): void {
            ScrollTween.removeTweens(this);
            this._ScrV_Props_._hScrollTween = null;
            this._ScrV_Props_._vScrollTween = null;
            this._ScrV_Props_._isHTweenPlaying = false;
            this._ScrV_Props_._isVTweenPlaying = false
            this.dispatchEvent(new Event(Event.COMPLETE));
        }

        /**
         * Set the scroll position above the distance
         * @param scrollTop Position above distance
         * @param duration Easing of time, in milliseconds
         * @returns Get tween vertical scrolling
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????????????????
         * @param scrollTop ?????????????????????
         * @param duration ???????????????????????????
         * @returns ?????????????????????tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public setScrollTop(scrollTop: number, duration: number = 0): void {
            let finalPosition = Math.min(this.getMaxScrollTop(), Math.max(scrollTop, 0));
            if (duration == 0) {
                this.scrollTop = finalPosition;
                return;
            }
            if (this._ScrV_Props_._bounces == false)
                scrollTop = finalPosition;
            let vtween = egret.ScrollTween.get(this).to({ scrollTop: scrollTop }, duration, egret.ScrollEase.quartOut);
            if (finalPosition != scrollTop) {
                vtween.to({ scrollTop: finalPosition }, 300, egret.ScrollEase.quintOut);
            }
            this._ScrV_Props_._isVTweenPlaying = true;
            this._ScrV_Props_._vScrollTween = vtween;
            vtween.call(this.onTweenFinished, this, [vtween]);
            if (!this._ScrV_Props_._isHTweenPlaying)
                this._onScrollStarted();
        }

        /**
         * Set the scroll position from the left side
         * @param scrollLeft From the position on the left side
         * @param duration Get tween vertical scrolling
         * @returns Gets the horizontal scroll tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????????????????
         * @param scrollLeft ?????????????????????
         * @param duration ???????????????????????????
         * @returns ?????????????????????tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public setScrollLeft(scrollLeft: number, duration: number = 0): void {
            let finalPosition = Math.min(this.getMaxScrollLeft(), Math.max(scrollLeft, 0));
            if (duration == 0) {
                this.scrollLeft = finalPosition;
                return;
            }
            if (this._ScrV_Props_._bounces == false)
                scrollLeft = finalPosition;
            let htween = egret.ScrollTween.get(this).to({ scrollLeft: scrollLeft }, duration, egret.ScrollEase.quartOut);
            if (finalPosition != scrollLeft) {
                htween.to({ scrollLeft: finalPosition }, 300, egret.ScrollEase.quintOut);
            }
            this._ScrV_Props_._isHTweenPlaying = true;
            this._ScrV_Props_._hScrollTween = htween;
            htween.call(this.onTweenFinished, this, [htween]);
            if (!this._ScrV_Props_._isVTweenPlaying)
                this._onScrollStarted();
        }

        /**
         * @private
         *
         * @param pixelsPerMS
         * @param curPos
         * @param maxPos
         * @returns
         */
        private getAnimationDatas(pixelsPerMS: number, curPos: number, maxPos: number): { position: number; duration: number } {
            let absPixelsPerMS: number = Math.abs(pixelsPerMS);
            let extraFricition: number = 0.95;
            let duration: number = 0;
            let friction: number = 0.998;
            let minVelocity: number = 0.02;
            let posTo: number = curPos + pixelsPerMS * 500;
            if (posTo < 0 || posTo > maxPos) {
                posTo = curPos;
                while (Math.abs(pixelsPerMS) != Infinity && Math.abs(pixelsPerMS) > minVelocity) {
                    posTo += pixelsPerMS;
                    if (posTo < 0 || posTo > maxPos) {
                        pixelsPerMS *= friction * extraFricition;
                    }
                    else {
                        pixelsPerMS *= friction;
                    }
                    duration++;
                }
            }
            else {
                duration = -Math.log(minVelocity / absPixelsPerMS) * 500;
            }

            let result = {
                position: Math.min(maxPos + 50, Math.max(posTo, -50)),//????????????50px
                duration: duration
            };
            return result;
        }

        /**
         * @private
         *
         * @param event
         * @returns
         */
        private cloneTouchEvent(event: TouchEvent): TouchEvent {
            let evt: TouchEvent = new TouchEvent(event.type, event.bubbles, event.cancelable);
            evt.touchPointID = event.touchPointID
            evt.$stageX = event.stageX;
            evt.$stageY = event.stageY;
            //evt.ctrlKey = event.ctrlKey;
            //evt.altKey = event.altKey;
            //evt.shiftKey = event.shiftKey;
            evt.touchDown = event.touchDown;
            evt.$isDefaultPrevented = false;
            evt.$target = event.target;
            return evt;
        }

        /**
         * @private
         *
         * @returns
         */
        private throwNotSupportedError(): void {
            egret.$error(1023);
        }

        /**
         * @deprecated
         * @inheritDoc
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addChild(child: DisplayObject): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }

        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addChildAt(child: DisplayObject, index: number): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }

        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChild(child: DisplayObject): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }

        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChildAt(index: number): DisplayObject {
            this.throwNotSupportedError();
            return null;
        }

        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setChildIndex(child: DisplayObject, index: number): void {
            this.throwNotSupportedError();
        }

        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void {
            this.throwNotSupportedError();
        }

        /**
         * @deprecated
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public swapChildrenAt(index1: number, index2: number): void {
            this.throwNotSupportedError();
        }

    }
}