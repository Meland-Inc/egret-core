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
     * The URLVariables class allows you to transfer variables between an application and a server.
     * Use URLVariables objects with methods of the URLLoader class and the data property of the URLRequest class.
     * @see http://edn.egret.com/cn/docs/page/598 Send the request with parameters
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLVariables.ts
     * @language en_US
     */
    /**
     * ?????? URLVariables ?????????????????????????????????????????????????????????
     * ??? URLVariables ????????? URLLoader ???????????????URLRequest ?????? data ?????????????????????
     * @see http://edn.egret.com/cn/docs/page/598 ????????????????????????
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLVariables.ts
     * @language zh_CN
     */
    export class URLVariables extends HashObject {

        /**
         * Create an egret.URLVariable object
         * @param source {String} A URL-encoded string containing name/value pairs.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ???????????? egret.URLVariables ??????
         * @param source {String} ????????????/????????? URL ?????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor(source:string = null) {
            super();
            if (source !== null) {
                this.decode(source);
            }
        }

        /**
         * Key-value pair data object saved in this URLVariables object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ??? URLVariables ?????????????????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public variables:Object = null;

        /**
         * Convert the variable string into the property of this URLVariables.variables object.
         * @param source {string}
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ?????????????????????????????? URLVariables.variables ??????????????????
         * @param source {string}
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public decode(source:string):void {
            if (!this.variables) {
                this.variables = {};
            }
            source = source.split("+").join(" ");
            let tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(source)) {
                let key = decodeURIComponent(tokens[1]),
                    val = decodeURIComponent(tokens[2]);
                //?????????????????????????????????
                if ((key in this.variables) == false) {
                    this.variables[key] = val;
                    continue;
                }
                //???????????????????????????????????????????????????push???????????????????????????????????????
                let value = this.variables[key];
                if (value instanceof Array) {
                    (<Array<string>>value).push(val)
                }
                else {
                    this.variables[key] = [value, val];
                }
            }
        }

        /**
         * Return a string containing all enumerable variables using  the MIME content encoding format : application/x-www-form-urlencoded.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ??? MIME ?????????????????? application/x-www-form-urlencoded ????????????????????????????????????????????????
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public toString():string {
            if (!this.variables) {
                return "";
            }
            let variables:any = this.variables;
            let stringArray:string[] = [];
            for (let key in variables) {
                stringArray.push(this.encodeValue(key, variables[key]));
            }
            return stringArray.join("&");
        }

        /**
         * @private
         * 
         * @param key 
         * @param value 
         */
        private encodeValue(key:string, value:any) {
            if (value instanceof Array) {
                return this.encodeArray(key, value);
            }
            else {
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
        }

        /**
         * @private
         * 
         * @param key 
         * @param value 
         */
        private encodeArray(key:string, value:string[]) {
            if (!key)
                return "";
            if (value.length == 0) {
                return encodeURIComponent(key) + "=";
            }
            return value.map(v=> encodeURIComponent(key) + "=" + encodeURIComponent(v)).join("&");
        }
    }
}