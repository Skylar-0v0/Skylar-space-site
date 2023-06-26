<script setup>
    import {
        ref,
        watch,
        onBeforeMount,
        onMounted
    } from 'vue'

    let props = defineProps({
        article: Object,
        index: Number
    })

    const crl = ref({
        main: false,
        pcBlogContent: '',
        pcBlogContentPosition: '',
        pcContent: '',
        peBlogContent: '',
        peflexCrl: '',
        peContent: '',
        peContentChild: '',
    })

    onBeforeMount(() => {
        let style = props.index % 2
        if (style) {
            crl.value.pcBlogContent = 'polygon(0% 0%,70% 0%, 100% 100%, 0% 100%)'
            crl.value.peBlogContent = 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)'
            crl.value.pcContent = '10%'
            crl.value.peflexCrl = 'row-reverse'
            crl.value.peContent = '8% 5% 0 0'
            crl.value.peContentChild = 'auto'
        } else {
            crl.value.pcBlogContent = 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)'
            crl.value.peBlogContent = 'polygon(0% 0%, 100% 30%, 100% 100%, 0% 100%)'
            crl.value.pcBlogContentPosition = 'auto'
            crl.value.pcContent = '35%'
            crl.value.peContent = '8% 0 0 5%'
        }
    })

    onMounted(() => {
        crl.value.main = true
    })
</script>

<template>
  <transition name="blur">
    <div class="blogCar car flex a-c position-r" v-show="crl.main">
      <div class="blogImg w-h-100p" :style="{'background-image':'url('+article.coverImg+')'}"></div>
      <div class="blogContanier position-a flex position-a w-h-100p">
        <div class="blogContent flex flexCrl">
          <div class="flex column j-c content">
            <h2 style="color: var(--color-theme-1);">{{article.title}}</h2>
            <p class="op-8">{{article.summary}}</p>
            <div class="flex">
              <uni-dateformat class="op-8" :date="article.public_date" format="yyyy/MM/dd"></uni-dateformat>
              <div class="flex op-8 view-count">
                <uni-icons type="eye" color="var(--color-font)" size="20"></uni-icons>
                <p>{{article.view_count}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
    @import '/pages/main.css';
    @media screen and (min-width:768px) {
        .blogCar {
            height: 175px;
        }
        .blogContent {
            margin-left: v-bind('crl.pcBlogContentPosition');
            height: 100%;
            width: 65%;
            clip-path: v-bind('crl.pcBlogContent');
        }
        .blogImg {
            background-position: center;
        }
        .content {
            margin-left: v-bind('crl.pcContent');
        }
        .content>* {
            margin-bottom: 20px;
        }
    }
    
    @media screen and (max-width:767px) {
        .blogCar {
            height: 225px;
        }
        .blogContent {
            margin-top: auto;
            height: 65%;
            width: 100%;
            clip-path: v-bind('crl.peBlogContent');
        }
        .flexCrl {
            flex-direction: v-bind('crl.peflexCrl');
        }
        .content {
            margin: v-bind('crl.peContent');
        }
        .content>* {
            margin-left: v-bind('crl.peContentChild');
            margin-bottom: 7px;
        }
    }
    
    .blogContent {
        transform: 2s;
        background-color: var(--color-box-2);
    }
    
    .blogImg {
        background-repeat: no-repeat;
        background-size: 100%;
        transition: 2s;
        filter: blur(2px) var(--blogCar-img-filter);
    }
    
    .blogCar {
        overflow: hidden;
        width: 500px;
        margin: 10px auto;
    }
    
    .view-count {
        margin-left: 15px;
    }
</style>