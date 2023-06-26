/* 用于控制页头的高度，以及首屏动画相关的副作用 */

import {
    defineStore
} from 'pinia'
import {
    ref,
} from 'vue'

export const useAtfStore = defineStore('atf', () => {
    const title = ref({ // 页首显示的标题
        main: '',
        sub: ''
    })
    const headerHeight = ref('') // 页首高度

    /* 每当路由改变时，相应的页面组件会调用下面的initHeader()函数 */

    function initHeader(height, title) {
        this.headerHeight = height
        if (!title) return
        this.title = {
            ...title
        }
    }

    const animation = ref({
        period: 0, // 动画阶段
        content: false // 用于提示其他模组作出相应副作用
    })

    return {
        title,
        headerHeight,
        animation,
        initHeader
    }
})