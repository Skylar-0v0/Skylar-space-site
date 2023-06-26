/** 用于更换主题，目前只有深色和浅色 */

import {
    defineStore
} from 'pinia'
import {
    ref
} from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const displaying = ref('')

    function switchTheme(theme) {
        this.displaying = theme
        for (let item in themeList[theme]) {
            document.documentElement.style.setProperty(item, themeList[theme][item])
        }
    }
    return {
        displaying,
        switchTheme
    }
})

const themeList = {
    light: {
        '--color-background': '#c7c7c7',
        '--color-background-box': '#d9d8d8',
        '--color-background-input': '#d9d8d8',
        '--color-background-mask': 'rgba(0, 0, 0, 0.3)',
        '--color-box-2': '#e9e9e9',
        '--color-bar-1': '#48373e',
        '--color-bar-2': '#dfdfdf',
        '--color-nav': '#3a2a32e3',
        '--color-nav-box': '#544249',
        '--color-shadow': '#b3abb1',
        '--color-font': '#1d1d1d',
        '--color-font-r': 'rgba(255, 255, 255, 0.8)',
        '--color-font-line': 'rgba(255, 255, 255, 0.5)',
        '--color-but-font': 'rgba(255, 255, 255, 0.8)',
        '--color-line': 'rgb(120 120 120 / 46%)',
        '--color-theme-1': '#ef94c9',
        '--color-theme-2': '#61a5f0',
        '--color-warn': '#de5f58',
        '--color-wait': 'rgb(86 86 86 / 50%)',
        '--color-message-dm': 'rgba(255, 255, 255, 0.6)',
        '--color-atf-font': 'rgba(255, 255, 255, 0.8)',
        '--atf-background-img': 'url(/static/bgL.jpg)',
        '--atf-bottom-filter': 'brightness(1)',
        '--blogCar-img-filter': 'brightness(80%)'
    },
    dark: {
        '--color-background': '#1d1d1d',
        '--color-background-box': '#232428',
        '--color-background-input': '#3b3c44',
        '--color-background-mask': 'rgba(0, 0, 0, 0.3)',
        '--color-box-2': '#2a2b32',
        '--color-bar-1': '#2a2b32',
        '--color-bar-2': '#2a2b32',
        '--color-nav': '#282b34de',
        '--color-nav-box': '#343642',
        '--color-shadow': '#1d1d1d',
        '--color-font': 'rgba(255, 255, 255, 0.8)',
        '--color-font-r': '#1d1d1d',
        '--color-font-line': 'rgba(255, 255, 255, 0.5)',
        '--color-but-font': 'rgba(255, 255, 255, 0.8)',
        '--color-line': 'rgb(255 254 254 / 15%)',
        '--color-theme-1': '#61a5f0',
        '--color-theme-2': '#e482b3',
        '--color-warn': '#de5f58',
        '--color-wait': 'rgba(255, 255, 255, 0.5)',
        '--color-message-dm': 'rgb(255 254 254 / 26%)',
        '--color-atf-font': 'rgba(255, 255, 255, 0.8)',
        '--atf-background-img': 'url(/static/bgD.jpg)',
        '--atf-bottom-filter': 'brightness(0.135)',
        '--blogCar-img-filter': 'brightness(50%)'
    }
}