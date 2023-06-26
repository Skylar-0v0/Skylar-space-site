<script setup>
    import {
        ref,
        onMounted,
        computed,
        watch,
        nextTick,
        onBeforeUnmount
    } from "vue"
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    const db = uniCloud.database()
    import articleList from './articleList.vue'
    import MarkdownIt from 'markdown-it'
    import articleCar from './articleCar.vue'
    import hljs from 'highlight.js'
    import 'highlight.js/styles/github-dark.css'

    const blogCss = {
        default: "https://mp-c64b873e-7273-4eba-bb2a-9a22c21b779a.cdn.bspapp.com/cloudstorage/d49476c0-12bb-4948-96c8-5eed0e165331.txt"
    }

    onMounted(() => {
        uni.request({
                url: blogCss.default
            }).then(res => {
                cssList.default = res.data
            })
            // 从数据库获取文章列表，但不获取文章内容，并按照创建时间排序
        db.collection('article-list')
            .field("_id,title,subtitle,imgUrls,coverImg,summary,status,create_date,public_date,view_count")
            .orderBy("create_date", "desc").get().then(res => {
                articleListData.value = res.result.data
            })
    })

    // onBeforeUnmount(() => {
    //     if (onfocus.value != null) saveArticle() // 如果当前有文章正在编辑，先保存
    // })

    const cssList = {}

    // 将markdown转换为html，并添加css
    const md = new MarkdownIt({
        html: true
    })


    const markdown = computed(() => {
        if (onfocus.value == null) return ''
        return '<div class="markdown">' + md.render(articleListData.value[onfocus.value].content) + cssList.default+'</div>'
    })

    // 文章状态
    const articleStatus = ref(['草稿（未发布）', '已发布', '隐藏'])

    // 文章信息初始化
    const articleInit = {
        title: '',
        subtitle: '',
        coverImg: '',
        content: '',
        imgUrls: [],
        summary: '',
        status: 0,
        public_date: 0,
        view_count: 0
    }

    // 文章列表
    const articleListData = ref([])

    // 导航控制
    const crl = ref({
        nav: '文章列表',
        edit: '文章信息'
    })

    // 选中文章
    const onfocus = ref(null)

    // 创建新文章
    function createArticle() {
        crl.value.nav = '文章编写'
        let init = {...articleInit
        }
        init.create_date = Date.now()
        articleListData.value.unshift({
            ...init
        })
        onfocus.value = 0
        watch(() => articleListData.value[onfocus.value].content, () => {
            nextTick(() => {
                console.log(333);
                document.querySelectorAll('pre code').forEach((el) => {
                    hljs.highlightElement(el)
                })
            })
        })
    }

    // 编辑文章
    async function editArticle(index) {
        if (onfocus.value == index) return crl.value.nav = '文章编写' // 如果点击的是当前文章，直接跳转到文章编辑页
        if (onfocus.value != null) { // 如果当前有文章正在编辑，先保存
            await saveArticle(false)
        }
        // 如果没有文章内容，就从数据库获取文章内容
        if (articleListData.value[index].content == undefined) {
            uni.showLoading({
                title: '正在获取文章内容'
            })
            let res = await db.collection('article-list').doc(articleListData.value[index]._id).field("content").get()
            articleListData.value[index].content = res.result.data[0].content
            uni.hideLoading()
        }

        onfocus.value = index
        crl.value.nav = '文章编写'
    }

    // 保存文章
    async function saveArticle(isPublic) {
        if (onfocus.value == null) return popUps.tip('没有文章在编辑', true)
            // 如果是isPublic为true，先询问是否发布,再检查文章信息是否完整
        if (isPublic) {
            let res = await uni.showModal({
                title: '提示',
                content: '是否发布文章？'
            })
            if (!res.confirm) return
            if (articleListData.value[onfocus.value].title == '') return popUps.tip('文章标题不能为空', true)
            if (articleListData.value[onfocus.value].subtitle == '') return popUps.tip('文章副标题不能为空', true)
            if (articleListData.value[onfocus.value].cover == '') return popUps.tip('文章封面不能为空', true)
            if (articleListData.value[onfocus.value].content == '') return popUps.tip('文章内容不能为空', true)
            if (articleListData.value[onfocus.value].summary == '') return popUps.tip('文章摘要不能为空', true)
            articleListData.value[onfocus.value].status = 1
            articleListData.value[onfocus.value].public_date = Date.now()
        }
        uni.showLoading({
            title: '保存中'
        })
        await updateImg()
        let imgUrls = [...articleListData.value[onfocus.value].imgUrls]
            // 替换文章图片markdown格式的url为云存储的url
        articleListData.value[onfocus.value].content = articleListData.value[onfocus.value].content.replace(/!\[.*?\]\((.*?)\)/g, () => {
            let url = imgUrls.shift()
            return `![img](${url})`
        })

        // 替换文章图片html格式的url为云存储的url,只替换src属性，不替换其他属性
        articleListData.value[onfocus.value].content = articleListData.value[onfocus.value].content.replace(/<img[^>]+src="([^">]+)"/g, () => {
            let url = imgUrls.shift()
            return `<img src="${url}"`
        })

        let data = {...articleListData.value[onfocus.value]
        }
        if (data._id) { // 如果有_id，说明是已经存在的文章，需要更新
            let id = data._id
            delete data._id
            delete data.create_date
            delete data.public_date
            await db.collection('article-list').doc(id).update(data).then(res => {
                popUps.tip(`${isPublic ? '发布' : '保存'}成功`)
            })
        } else {
            await db.collection('article-list').add(data).then(res => {
                articleListData.value[onfocus.value]._id = res.result.id
                popUps.tip(`${isPublic ? '发布' : '保存'}成功`)
            })
        }
        uni.hideLoading()
    }

    // 上传文章中的图片，以及删除文章中已经删除的图片
    async function updateImg() {
        if (onfocus.value == null) return
        let data = articleListData.value[onfocus.value].imgUrls
            // 提取文章内容中的图片
        let urls = getImgUrls()
            // 对比data和urls，如果data中有，urls中没有，说明图片已经被删除，需要删除data中的图片
        let deleteImg = []
        for (let i = 0; i < data.length; i++) {
            if (urls.indexOf(data[i]) == -1) {
                deleteImg.push(data[i])
            }
        }
        // 对比data和urls，如果data中没有，urls中有，说明图片是新添加的，需要上传图片,并找出新添加的图片在urls中的位置
        let newImg = []
        let position = []
        for (let i = 0; i < urls.length; i++) {
            if (data.indexOf(urls[i]) == -1) {
                newImg.push(urls[i])
                position.push(i)
            }
        }
        return Promise.all([
            // 调用云函数删除图片
            deleteImg.length > 0 ? uniCloud.callFunction({
                name: 'blogTest',
                data: {
                    api: 'deleteImg',
                    args: {
                        urls: deleteImg,
                        useToken: true
                    }
                }
            }) : null,
            // 上传图片,将新图片的url替换到urls中,并更新data
            newImg.length > 0 ? Promise.all(newImg.map(url => uploadImgPromise(url))).then(res => {
                res.forEach((item, index) => {
                    urls[position[index]] = item
                })
                articleListData.value[onfocus.value].imgUrls = urls
            }) : null
        ])
    }

    // 提取文章内容中的图片
    function getImgUrls() {
        if (onfocus.value == null) return
        let data = articleListData.value[onfocus.value]
        let imgUrls = []
        let reg1 = /!\[.*?\]\((.*?)\)/g // 匹配markdown中的图片
        let reg2 = /<img.*?src="(.*?)".*?>/g // 匹配html中的图片
        let result
        while (result = reg1.exec(data.content)) {
            imgUrls.push(result[1])
        }
        while (result = reg2.exec(data.content)) {
            imgUrls.push(result[1])
        }

        return imgUrls
    }

    // 返回图片上传的promise
    function uploadImgPromise(url) {
        return new Promise((resolve, reject) => {
            uniCloud.uploadFile({
                cloudPath: 'article/' + Date.now() + url.match(/\.(\w+)$/)[0],
                filePath: url
            }).then(res => {
                resolve(res.fileID)
            })
        })
    }

    // function ImgPromise(element) {
    //     return new Promise((resolve, reject) => {
    //         app.globalData.el.getTempFileURL({
    //             fileList:[{
    //                 fileID: element.img,
    //                 maxAge: 60 *60
    //             }] 
    //         }).then(res => {
    //             element.imghttp = res.fileList[0].tempFileURL
    //             resolve(element)
    //         })
    //     })
    // }

    // let newlist = []
    // Promise.all(goodslist.map(element => ImgPromise(element))).then(res => {
    //     newlist = res
    // })

    // 删除文章
    async function deleteArticle() {
        if (onfocus.value == null) return popUps.tip('没有文章在编辑', true)
            // 询问是否删除
        let res = await uni.showModal({
            title: '提示',
            content: '是否删除文章？',
            confirmText: '删除',
            confirmColor: '#f00'
        })
        if (!res.confirm) return
        uni.showLoading({
            title: '删除中'
        })
        let data = articleListData.value[onfocus.value]
        if (!data._id) { // 如果没有_id，说明是新文章
            articleListData.value.splice(onfocus.value, 1)
            onfocus.value = null
            popUps.tip('删除成功')
        } else {
            // 文章的图片数组，如果有coverImg，也要删除
            let imgUrls = data.imgUrls
            if (data.coverImg != '') {
                if (imgUrls.indexOf(data.coverImg) == -1) {
                    imgUrls.push(data.coverImg)
                }
            }
            Promise.all([
                imgUrls.length > 0 ? await uniCloud.callFunction({
                    name: 'blogTest',
                    data: {
                        api: 'deleteImg',
                        args: {
                            urls: imgUrls,
                            useToken: true
                        }
                    }
                }) : null,
                await db.collection('article-list').doc(data._id).remove().then(res => {
                    articleListData.value.splice(onfocus.value, 1)
                    onfocus.value = null
                    popUps.tip('删除成功')
                })
            ])
        }
        crl.value.nav = '文章列表'
        uni.hideLoading()
    }

    // 修改封面图片
    async function updateCoverImg() {
        if (onfocus.value == null) return popUps.tip('没有文章在编辑', true)
            // 上传coverImg,删除原来的coverImg
        uni.showLoading()
        Promise.all([
            articleListData.value[onfocus.value].coverImg == '' ? null : await uniCloud.callFunction({
                name: 'blogTest',
                data: {
                    api: 'deleteImg',
                    args: {
                        urls: [articleListData.value[onfocus.value].coverImg],
                        useToken: true
                    }
                }
            }),
            await uploadImgPromise(articleListData.value[onfocus.value].coverImg).then(res => {
                articleListData.value[onfocus.value].coverImg = res
            })
        ])
        uni.hideLoading()
        popUps.tip('上传成功')
    }
</script>

<template>
  <div class="flex column w-h-100p">
    <!-- 顶部导航 -->
    <div class="article-nav flex w-100p a-c">
      <button class="but"  @click="crl.nav='文章列表'" :class="{'but-theme-1':crl.nav=='文章列表'}" style="margin-left: 30px;">文章列表</button>
      <button class="but" @click="crl.nav='css编辑'" :class="{'but-theme-1':crl.nav=='css编辑'}">css编辑</button>
      <button class="but" @click="crl.nav='文章编写'" :class="{'but-theme-1':crl.nav=='文章编写'}">文章编写</button>
      <button class="but but-theme-1" @click="saveArticle(false)" style="margin-left: auto;">保存</button>
      <button class="but but-theme-1" @click="saveArticle(true)" v-show="onfocus != null && articleListData[onfocus].status == 0">发布</button>
      <button class="but but-warn" @click="deleteArticle()" style="margin-right: 30px;">删除</button>
    </div>
    <!-- 文章列表页 -->
    <article-list @createArticle="createArticle()" @editArticle="editArticle" :nowOnfocus="onfocus" :articleStatus="articleStatus" :data="articleListData" v-if="crl.nav == '文章列表'"></article-list>
    <!-- 文章编写页 -->
    <div class="w-100p flex" style="height: calc(100% - 60px);" v-show="crl.nav =='文章编写'">
      <div class="left column flex a-c" >
        <h4 class="title">文章编写</h4>
        <!-- 文章编辑导航 -->
        <div class="flex w-100p" style="margin-top: 10px;justify-content:space-around ;">
          <button class="but" @click="crl.edit='文章信息'" :class="{'but-theme-1':crl.edit=='文章信息'}">文章信息</button>
          <button class="but" @click="crl.edit='文章内容'" :class="{'but-theme-1':crl.edit=='文章内容'}" >文章内容</button>
        </div>
        <!-- 文章内容编写 -->
        <textarea maxlength="-1" class="article-input" v-if="onfocus != null" v-model="articleListData[onfocus].content" v-show="crl.edit=='文章内容'"></textarea>
        <!-- 文章信息编写 -->
        <div class="flex column article-info" v-if="onfocus != null" v-show="crl.edit=='文章信息'">
            <div class="flex">
                <p style="width: 80px;text-align: right;">_id：</p>
                <p>{{articleListData[onfocus]._id || '未上传'}}</p>
            </div>
            <div class="flex">
                <p style="width: 80px;text-align: right;">标题：</p>
                <input type="text" v-model="articleListData[onfocus].title">
            </div>
            <div class="flex">
                <p style="width: 80px;text-align: right;">副标题：</p>
                <input type="text" v-model="articleListData[onfocus].subtitle">
            </div>
            <div class="flex">
                <p style="width: 80px;text-align: right;">摘要：</p>
                <textarea v-model="articleListData[onfocus].summary"></textarea>
            </div>
            <div class="flex a-c">
                <p style="width: 80px;text-align: right;">封面：</p>
                <input type="text" style="width: 60%;" v-model="articleListData[onfocus].coverImg">
                <button @click="updateCoverImg()" class="but-uploadCover">上传封面</button>
            </div>
            
            <div class="flex">
                <p style="width: 80px;text-align: right;">文章状态：</p>
                <p>{{articleStatus[articleListData[onfocus].status]}}</p>
            </div>
            <articleCar style="transform: translateX(-31px)" :article="articleListData[onfocus]" :index="0" />
        </div>
      </div>
      <!-- 同步显示文章内容 -->
      <div class="right column flex a-c">
        <h4 class="title">文章预览</h4>
        <div class="preview" v-html="markdown"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @import './articleEditor.css';
    .article-nav {
        height: 60px;
        border-bottom: 1px solid var(--color-line);
    }
    
    .left {
        flex: 1;
        border-right: 1px solid var(--color-line);
    }
    
    .right {
        flex: 1
    }
    
    .article-input {
        margin-top: 10px;
        width: 95%;
        height: 85%;
    }
    
    textarea {
        background-color: var(--color-background-box);
    }
    
    .preview {
        margin-top: 15px;
        width: 95%;
        height: 90%;
        overflow: scroll;
    }
    
    .preview::-webkit-scrollbar {
        display: none;
    }
    
    .input {
        width: 300px;
        background-color: var(--color-background-box);
    }
    
    .article-info {
        margin-top: 5px;
        width: 70%;
    }
    
    .article-info>* {
        margin-top: 25px;
    }
    
    .article-info p {
        white-space: nowrap;
    }
    
    .article-info input {
        width: 85%;
        background-color: var(--color-background-box);
    }
    
    .article-info textarea {
        width: 85%;
        height: 100px;
    }
    
    .but-uploadCover {
        margin: 0 0 0 10px;
        border-radius: 50px;
        white-space: nowrap;
        border: 1px solid var(--color-theme-1);
        background-color: var(--color-theme-1);
        color: var(--color-but-font);
        cursor: pointer;
    }
</style>