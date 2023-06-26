<script setup>
    import {
        ref,
        watch
    } from 'vue'
    defineProps({
        data: Array,
        articleStatus: Array,
        nowOnfocus: Number || null
    })
    import articleCar from './articleCar.vue'

    const emit = defineEmits(['createArticle', 'editArticle'])

    // 创建新文章
    function createArticle() {
        emit('createArticle')
    }

    // 编写选中文章
    function editArticle() {
        emit('editArticle', onfocus.value)
    }

    // 选中文章
    const onfocus = ref(null)
</script>

<template>
    <div class="flex w-100p" style="height: calc(100% - 60px);">
        <!-- 左侧简单列表 -->
        <div class="article-list1 flex column a-c">
            <h4 class="title">文章列表</h4>  
            <button @click="createArticle" class="luminousBox">写新文章</button>
            <div class="list-container-l">
                <div v-for="(item, index) in data" :class="{'onfocus':nowOnfocus==index||onfocus==index,'luminousBox':nowOnfocus!=index&&onfocus!=index}"
                class="list-item-l pointer" @click="onfocus=index">
                    {{item.title || '无标题文章'}}
                </div>
            </div>
        </div>
        <!-- 中间效果浏览列表 -->
        <div class="article-list2">
            <div v-for="(item, index) in data">
                  <articleCar :article="item" :index="index" @click="onfocus=index" />
              </div>
        </div>
        <!-- 右侧文章信息 -->
        <div class="flex column a-c" style="flex: 3;">
            <h4 class="title">文章信息</h4>
            <div class="article-info flex column a-c" v-if="onfocus != null">
                <div class="flex">
                    <p style="width: 80px;text-align: right;">_id：</p>
                    <p>{{data[onfocus]._id || '未上传'}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">标题：</p>
                    <p>{{data[onfocus].title}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">副标题：</p>
                    <p>{{data[onfocus].subtitle}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">文章状态：</p>
                    <p>{{articleStatus[data[onfocus].status]}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">封面：</p>
                    <p>{{data[onfocus].coverImg?'√':'×'}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">创建时间：</p>
                    <p>{{data[onfocus].create_date}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">发布时间：</p>
                    <p>{{data[onfocus].public_date||'未发布'}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">浏览量：</p>
                    <p>{{data[onfocus].view_count}}</p>
                </div>
                <div class="flex">
                    <p style="width: 80px;text-align: right;">摘要：</p>
                    <p style="height: 100px;white-space:normal;">{{data[onfocus].summary}}</p>
                </div>
                <button class="luminousBox" @click="editArticle()">编辑</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @import './articleEditor.css';
    .article-list1 {
        flex: 2;
        border-right: 1px solid var(--color-line);
    }
    
    .article-list2 {
        flex: 4;
        border-right: 1px solid var(--color-line);
    }
    
    .article-info {
        width: 75%;
    }
    
    .article-info>* {
        margin-top: 25px;
    }
    
    .article-info>div {
        width: 100%;
    }
    
    .article-info p {
        white-space: nowrap;
    }
    
    .title {
        margin-top: 15px;
    }
    
    button {
        margin-top: 20px;
        padding: 0 50px;
        border: 1px solid var(--color-line);
    }
    
    button:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .list-container-l {
        margin-top: 20px;
        width: 90%;
        height: 80%;
        background-color: var(--color-background-box);
        overflow: scroll;
    }
    
    .list-container-l::-webkit-scrollbar {
        display: none;
    }
    
    .list-item-l {
        transition: 0.75s;
    }
    
    .onfocus {
        background-color: var(--color-theme-1);
        color: var(--color-but-font);
    }
</style>