namespace egret {
    /**
     * 指定的反射global 用来反射使用的 由于runtime修改了window的设置属性权限 加入闭包后游戏测无法通过window指定global
     */
    export let reflectGlobal;

    /**当前webgl的纹理数量 */
    export let webglTextureNum: number = 0;

    /**性能档位 */
    export enum ePerfType {
        high = 1,
        medium,
        low
    }

    /**外部不要使用 */
    export let $curPerf: ePerfType = ePerfType.medium;

    /**设置性能 */
    export function setPerf(tValue: ePerfType): void {
        $curPerf = tValue;
    }

    /**刷新渲染尺寸 一般不需要*/
    export function refreshRenderSize(): void {
        lifecycle.stage.$screen.updateScreenSize();
    }
}
