/* 用于保存部分从后端获取的信息 */

import {
    defineStore
} from 'pinia'
import {
    ref
} from 'vue'
const db = uniCloud.database()

export const useWebInfoStore = defineStore('webInfo', () => {
    const data = ref({})
    const articleList = ref([])

    async function getData() {
        db.collection('webInfo').doc('main')
            .field("web_view_count,messages_count,user_count,article")
            .get().then(res => {
                this.data = {
                    ...res.result.data[0]
                }
            })
    }

    // 获取文章列表
    async function getArticleList() {
        db.collection('article-list').where("status == 1")
            .field("_id,title,subtitle,coverImg,summary,public_date,view_count")
            .orderBy("public_date", "desc").get().then(res => {
                this.articleList = res.result.data
            })
    }

    return {
        data,
        getData,
        articleList,
        getArticleList
    }
})