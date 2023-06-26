<script setup>
    import {
        ref,
        onMounted,
        watch,
        onBeforeMount,
        computed,
        nextTick
    } from "vue"
    import cf from '../../utils/cf.js'
    import {
        useRoute,
        useRouter
    } from 'vue-router';
    const route = useRoute()
    const router = useRouter()
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()
    import MarkdownIt from 'markdown-it'

    onBeforeMount(() => {
        atf.initHeader(40)
    })

    onMounted(() => {
        watch(() => route.query.article, (n, o) => {
            if (n != o) {
                crl.value.main = false
                crl.value.blogLoaded = false
                init()
            }
        }, {
            immediate: true
        })
        let watchContent = watch([() => crl.value.blogLoaded, () => atf.animation.content], ([n1, n2]) => {
            if (n1 && n2) {
                crl.value.main = true
                nextTick(() => {
                    watchContent()
                })
            }
        }, {
            immediate: true
        })
    })

    function init() {
        // 如果没有传入文章名，跳转到首页
        if (!route.query.article) {
            return router.push({
                name: 'home'
            })
        }
        // 获取文章内容
        Promise.all([
            new Promise((resolve) => {
                uniCloud.database().collection('article-list').where(`title == "${route.query.article}"`)
                    .field("title,subtitle,content").get().then(res => {
                        // 如果没有找到文章，跳转到首页
                        if (res.result.data.length == 0) {
                            return router.push({
                                name: 'home'
                            })
                        }
                        atf.initHeader(40, {
                            main: res.result.data[0].title,
                            sub: res.result.data[0].subtitle
                        })
                        resolve(res.result.data[0].content)
                    })
            }),
            new Promise((resolve) => {
                uni.request({
                    url: articleCss.default
                }).then(res => {
                    resolve(res.data)
                })
            })
        ]).then(res => {
            content = computed(() => {
                return '<div class="markdown">' + MarkdownIt({
                    html: true
                }).render(res[0]) + res[1] + '</div>'
            })
            crl.value.blogLoaded = true
        })
    }

    let articleCss = {
        default: "https://mp-c64b873e-7273-4eba-bb2a-9a22c21b779a.cdn.bspapp.com/cloudstorage/d49476c0-12bb-4948-96c8-5eed0e165331.txt"
    }

    let crl = ref({
        main: false,
        blogLoaded: false
    })

    let content
</script>

<template>
  <div class="pageContainer car">
    <transition name="blur">
      <div v-html="content" v-show="crl.main">
      </div>
    </transition>
  </div>
</template>

<style>
    @import '/pages/main.css';
    .car {
        padding: 30px 0;
    }
</style>