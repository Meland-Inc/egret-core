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
     * @private
     */
    export class ScrollEase {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {
            egret.$error(1014);
        }

        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get(amount):Function {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            }
        }
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintOut = ScrollEase.getPowOut(5);

        /**
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowOut(pow):Function {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartOut = ScrollEase.getPowOut(4);

    }
	/**
     * @private
	 */
    export class ScrollTween extends EventDispatcher {

        /**
         * @private
         */
        private static _tweens:ScrollTween[] = [];
        /**
         * @private
         */
        private static IGNORE = {};
        /**
         * @private
         */
        private static _plugins = {};
        /**
         * @private
         */
        private static _inited = false;

        /**
         * @private
         */
        private _target:any = null;
        /**
         * @private
         */
        private _useTicks:boolean = false;
        /**
         * @private
         */
        private ignoreGlobalPause:boolean = false;
        /**
         * @private
         */
        private loop:boolean = false;
        /**
         * @private
         */
        private pluginData = null;
        /**
         * @private
         */
        private _curQueueProps;
        /**
         * @private
         */
        private _initQueueProps;
        /**
         * @private
         */
        private _steps:any[] = null;
        /**
         * @private
         */
        private _actions:any[] = null;
        /**
         * @private
         */
        private paused:boolean = false;
        /**
         * @private
         */
        private duration:number = 0;
        /**
         * @private
         */
        private _prevPos:number = -1;
        /**
         * @private
         */
        private position:number = null;
        /**
         * @private
         */
        private _prevPosition:number = 0;
        /**
         * @private
         */
        private _stepPosition:number = 0;
        /**
         * @private
         */
        private passive:boolean = false;

		/**
         * Activate an object and add a ScrollTween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * ????????????????????????????????? ScrollTween ??????
         * @param target {any} ????????? ScrollTween ?????????
         * @param props {any} ???????????????loop(????????????) onChange(????????????) onChangeObj(?????????????????????)
         * @param pluginData {any} ????????????
         * @param override {boolean} ?????????????????????????????????tween????????????false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static get(target:any, props:any = null, pluginData:any = null, override:boolean = false):ScrollTween {
            if (override) {
                ScrollTween.removeTweens(target);
            }
            return new ScrollTween(target, props, pluginData);
        }

		/**
         * Delete all ScrollTween animations from an object
		 * @param target The object whose ScrollTween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * ?????????????????????????????? ScrollTween ??????
		 * @param target  ???????????? ScrollTween ?????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static removeTweens(target:any):void {
            if (!target.tween_count) {
                return;
            }
            let tweens:ScrollTween[] = ScrollTween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }

        /**
         * @private
         * 
         * @param delta 
         * @param paused 
         */
        private static tick(timeStamp:number, paused = false):boolean {
            let delta = timeStamp - ScrollTween._lastTime;
            ScrollTween._lastTime = timeStamp;

            let tweens:ScrollTween[] = ScrollTween._tweens.concat();
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween:ScrollTween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
            return false;
        }

        private static _lastTime:number = 0;
        /**
         * @private
         * 
         * @param tween 
         * @param value 
         */
        private static _register(tween:ScrollTween, value:boolean):void {
            let target:any = tween._target;
            let tweens:ScrollTween[] = ScrollTween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!ScrollTween._inited) {
                    ScrollTween._lastTime = egret.getTimer();
                    ticker.$startTick(ScrollTween.tick, null);
                    ScrollTween._inited = true;
                }
            } else {
                if (target) {
                    target.tween_count--;
                }
                let i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        }

        /**
         * ???????????? egret.ScrollTween ??????
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target:any, props:any, pluginData:any) {
            super();
            this.initialize(target, props, pluginData);
        }

        /**
         * @private
         * 
         * @param target 
         * @param props 
         * @param pluginData 
         */
        private initialize(target:any, props:any, pluginData:any):void {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    ScrollTween.removeTweens(target);
                }
            }

            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            this._actions = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                ScrollTween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position);
            }
        }

        /**
         * @private
         * 
         * @param value 
         * @param actionsMode 
         * @returns 
         */
        private setPosition(value:number, actionsMode:number = 1):boolean {
            if (value < 0) {
                value = 0;
            }

            //???????????????
            let t:number = value;
            let end:boolean = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }

            let prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;

            if (this._target) {
                if (end) {
                    //??????
                    this._updateTargetProps(null, 1);
                } else if (this._steps.length > 0) {
                    // ????????????tween
                    let i:number;
                    let l = this._steps.length;
                    for (i = 0; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    let step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                }
            }

            if (end) {
                this.setPaused(true);
            }

            //??????actions
            if (actionsMode != 0 && this._actions.length > 0) {
                if (this._useTicks) {
                    this._runActions(t, t);
                } else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                } else {
                    this._runActions(prevPos, t);
                }
            }

            this.dispatchEventWith("change");
            return end;
        }

        /**
         * @private
         * 
         * @param startPos 
         * @param endPos 
         * @param includeStart 
         */
        private _runActions(startPos:number, endPos:number, includeStart:boolean = false) {
            let sPos:number = startPos;
            let ePos:number = endPos;
            let i:number = -1;
            let j:number = this._actions.length;
            let k:number = 1;
            if (startPos > endPos) {
                //??????????????????
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                let action = this._actions[i];
                let pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                }
            }
        }

        /**
         * @private
         * 
         * @param step 
         * @param ratio 
         */
        private _updateTargetProps(step:any, ratio:number) {
            let p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            } else {
                this.passive = !!step.v;
                //?????????props.
                if (this.passive) {
                    return;
                }
                //??????ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }

            for (let n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof(v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }

                let ignore = false;
                if (arr = ScrollTween._plugins[n]) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        let v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == ScrollTween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                }
            }

        }

		/**
         * Whether setting is paused
		 * @param value {boolean} Whether to pause
		 * @returns ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * ??????????????????
		 * @param value {boolean} ????????????
		 * @returns Tween????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public setPaused(value:boolean):ScrollTween {
            this.paused = value;
            ScrollTween._register(this, !value);
            return this;
        }

        /**
         * @private
         * 
         * @param props 
         * @returns 
         */
        private _cloneProps(props):any {
            let o = {};
            for (let n in props) {
                o[n] = props[n];
            }
            return o;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addStep(o):ScrollTween {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _appendQueueProps(o):any {
            let arr, oldValue, i, l, injectProps;
            for (let n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    //??????plugins
                    if (arr = ScrollTween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                } else {
                    oldValue = this._curQueueProps[n];
                }
            }

            for (let n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = ScrollTween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addAction(o):ScrollTween {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        }

		/**
         * Modify the property of the specified display object to a specified value
		 * @param props {Object} Property set of an object
		 * @param duration {number} Duration
		 * @param ease {egret.ScrollEase} Easing algorithm
		 * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * ????????????????????????????????????????????????
		 * @param props {Object} ?????????????????????
		 * @param duration {number} ????????????
		 * @param ease {egret.ScrollEase} ????????????
		 * @returns {egret.ScrollTween} Tween????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public to(props, duration?:number, ease:Function = undefined):ScrollTween {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props))});
        }

		/**
         * Execute callback function
		 * @param callback {Function} Callback method
		 * @param thisObj {any} this action scope of the callback method
		 * @param params {any[]} Parameter of the callback method
		 * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
		 */
		/**
         * ??????????????????
		 * @param callback {Function} ????????????
		 * @param thisObj {any} ????????????this?????????
		 * @param params {any[]} ??????????????????
		 * @returns {egret.ScrollTween} Tween????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public call(callback:Function, thisObj:any = undefined, params:any[] = undefined):ScrollTween {
            return this._addAction({f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target});
        }

		/**
		 * @method egret.ScrollTween#tick
		 * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public tick(delta:number):void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }
    }
}
