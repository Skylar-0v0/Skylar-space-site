import App from './App'
import {
  createApp
} from 'vue'

import {
  router
} from '/router/router.js'

import {
  createPinia
} from 'pinia'

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

// 创建vue实例

const app = createApp(App)
app.mount('#app')

// 注册路由
app.use(router)

// 注册pinia
const pinia = createPinia()
app.use(pinia)
export default pinia

app.directive("highlight", function(el) {
  let blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});
