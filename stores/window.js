/* 保存用户窗口大小相关的信息，主要用于页面的响应式 */

import {
    defineStore
} from 'pinia'
import {
    ref,
} from 'vue'

export const useWindowStore = defineStore('Window', () => {
    const windowWidth = ref(document.documentElement.clientWidth)
    const windowHeight = ref(document.documentElement.clientHeight)
    const scrollPosition = ref(0) // 滚轮位置
    const isLandscape = ref(null)
    const route = ref([''])

    function changeWindow() { // 每当窗口大小发生变化，组件 pages/main/main.vue 就会调用这个函数
        this.windowWidth = document.documentElement.clientWidth
        this.windowHeight = document.documentElement.clientHeight
        this.isLandscape = this.windowWidth > this.windowHeight
    }

    return {
        windowWidth,
        windowHeight,
        scrollPosition,
        isLandscape,
        route,
        changeWindow
    }
})