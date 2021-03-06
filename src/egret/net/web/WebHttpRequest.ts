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

namespace egret.web {

    /**
     * @private
     */
    export class WebHttpRequest extends EventDispatcher implements HttpRequest {

        /**
         * @private
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        private _xhr: XMLHttpRequest;

        /**
         * 
         */
        public timeout: number = 0;

        /**
         * @private
         * ????????????????????????????????????????????????responseType?????????????????????
         */

        public get response(): any {
            if (!this._xhr) {
                return null;
            }

            if (this._xhr.response != undefined) {
                return this._xhr.response;
            }

            if (this._responseType == "text") {
                return this._xhr.responseText;
            }

            if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent)) {
                let w: any = window;
                return w.convertResponseBodyToText(this._xhr["responseBody"]);
            }

            if (this._responseType == "document") {
                return this._xhr.responseXML;
            }

            /*if (this._xhr.responseXML) {
                return this._xhr.responseXML;
            }
            if (this._xhr.responseText != undefined) {
                return this._xhr.responseText;
            }*/
            return null;
        }

        /**
         * @private
         */
        private _responseType: "" | "arraybuffer" | "blob" | "document" | "json" | "text";

        /**
         * @private
         * ??????????????????????????????????????? HttpResponseType ?????????????????????????????????????????????????????????????????????HttpResponseType.TEXT???
         */
        public get responseType(): "" | "arraybuffer" | "blob" | "document" | "json" | "text" {
            return this._responseType;
        }

        public set responseType(value: "" | "arraybuffer" | "blob" | "document" | "json" | "text") {
            this._responseType = value;
        }

        /**
         * @private
         */
        private _withCredentials: boolean;

        /**
         * @private
         * ?????????????????????(cross-site)???????????????(Access-Control)????????????????????????????????????(??????cookie????????????header)??? ????????? false???(???????????????????????????????????????)
         */
        public get withCredentials(): boolean {
            return this._withCredentials;
        }

        public set withCredentials(value: boolean) {
            this._withCredentials = value;
        }

        /**
         * @private
         */
        private _url: string = "";
        private _method: string = "";

        /**
         * @private
         *
         * @returns
         */
        private getXHR(): any {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            } else {
                return new ActiveXObject("MSXML2.XMLHTTP");
            }
        }

        /**
         * @private
         * ?????????????????????.????????????????????????????????????????????????????????????????????????????????????abort().
         * @param url ????????????????????????URL????????????????????????URL
         * @param method ??????????????????HTTP????????? ????????? HttpMethod ??????????????????.
         */
        public open(url: string, method: string = "GET"): void {
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = null;
            }
            let xhr = this.getXHR();//new XMLHttpRequest();
            if (window["XMLHttpRequest"]) {
                xhr.addEventListener("load", this.onload.bind(this));
                xhr.addEventListener("error", this.onerror.bind(this));
            } else {
                xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            }
            xhr.onprogress = this.updateProgress.bind(this);
            xhr.ontimeout = this.onTimeout.bind(this)
            xhr.open(this._method, this._url, true);
            this._xhr = xhr;
        }

        /**
         * @private
         * ????????????.
         * @param data ?????????????????????
         */
        public send(data?: any): void {
            if (this._responseType != null) {
                this._xhr.responseType = this._responseType;
            }
            if (this._withCredentials != null) {
                this._xhr.withCredentials = this._withCredentials;
            }
            if (this.headerObj) {
                for (let key in this.headerObj) {
                    this._xhr.setRequestHeader(key, this.headerObj[key]);
                }
            }
            this._xhr.timeout = this.timeout;
            this._xhr.send(data);
        }

        /**
         * @private
         * ???????????????????????????,?????????????????????.
         */
        public abort(): void {
            if (this._xhr) {
                this._xhr.abort();
            }
        }

        /**
         * @private
         * ???????????????????????????(??????????????????), ???????????????????????????,?????????"".
         */
        public getAllResponseHeaders(): string {
            if (!this._xhr) {
                return null;
            }
            let result = this._xhr.getAllResponseHeaders();
            return result ? result : "";
        }

        private headerObj: any;
        /**
         * @private
         * ????????????HTTP???????????????.????????????,??????????????????????????? open() ?????????????????????url.
         * @param header ?????????????????????????????????.
         * @param value ??????????????????????????????.
         */
        public setRequestHeader(header: string, value: string): void {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        }

        /**
         * @private
         * ??????????????????????????????, ??????????????????????????????,????????????????????????,?????????"".
         * @param header ???????????????????????????
         */
        public getResponseHeader(header: string): string {
            if (!this._xhr) {
                return null;
            }
            let result = this._xhr.getResponseHeader(header);
            return result ? result : "";
        }
        /**
         * @private
         */
        private onTimeout(): void {
            if (DEBUG) {
                egret.$warn(1052, this._url);
            }
            this.dispatchEventWith(IOErrorEvent.IO_ERROR);
        }

        /**
         * @private
         */
        private onReadyStateChange(): void {
            let xhr = this._xhr;
            if (xhr.readyState == 4) {// 4 = "loaded"
                let ioError = (xhr.status >= 400 || xhr.status == 0);
                let url = this._url;
                let self = this;
                window.setTimeout(() => {
                    if (ioError) {//????????????
                        if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                            $error(1011, url);
                        }
                        self.dispatchEventWith(IOErrorEvent.IO_ERROR, false, xhr.status);
                    }
                    else {
                        self.dispatchEventWith(Event.COMPLETE);
                    }
                }, 0)

            }
        }

        /**
         * @private
         */
        private updateProgress(event): void {
            if (event.lengthComputable) {
                ProgressEvent.dispatchProgressEvent(this, ProgressEvent.PROGRESS, event.loaded, event.total);
            }
        }


        /**
         * @private
         */
        private onload(): void {
            let self = this;
            let xhr = this._xhr;
            let url = this._url;
            let ioError = (xhr.status >= 400);
            window.setTimeout(() => {
                if (ioError) {//????????????
                    if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                        $error(1011, url);
                    }
                    self.dispatchEventWith(IOErrorEvent.IO_ERROR, false, xhr.status);
                }
                else {
                    self.dispatchEventWith(Event.COMPLETE);
                }
            }, 0);
        }

        /**
         * @private
         */
        private onerror(): void {
            let url = this._url;
            let self = this;
            window.setTimeout(() => {
                if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                    $error(1011, url);
                }
                self.dispatchEventWith(IOErrorEvent.IO_ERROR, false, this._xhr && this._xhr.status);
            }, 0);
        }
    }
    HttpRequest = WebHttpRequest;

}
