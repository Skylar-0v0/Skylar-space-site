/** 弹窗相关的操作 */

import {
    defineStore
} from 'pinia'
import {
    ref
} from 'vue'

export const usePopUpsStore = defineStore('popUps', () => {
    const displaying = ref(null) // 当前显示的弹窗，他的值是一个类似路由路径的数组
    const args = ref({}) // 给弹窗传递的参数
    const tipArgs = ref({
        message: '',
        style: 'var(--color-theme-1)'
    })

    function tip(message, warn) {
        this.tipArgs.message = message
        this.tipArgs.style = warn ? 'var(--color-warn)' : 'var(--color-theme-1)'
    }

    function callPopUps(ups, args) {
        this.displaying = ups
        this.args = args
    }

    function shutPopUps() {
        this.displaying = []
        this.args = {}
    }

    return {
        displaying,
        args,
        tipArgs,
        tip,
        callPopUps,
        shutPopUps
    }
})