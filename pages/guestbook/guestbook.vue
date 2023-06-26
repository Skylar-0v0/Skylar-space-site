<script setup>
    import {
        watch,
        ref,
        onMounted,
        onBeforeMount,
        onBeforeUnmount,
        nextTick
    } from 'vue'
    import cf from '../../utils/cf.js'
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    import {
        useThemeStore
    } from '/stores/theme.js'
    const theme = useThemeStore()
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()
    import msg from './msg.vue'
    import inputUps from './inputUps.vue'
    const db = uniCloud.database()

    onBeforeMount(() => {
        atf.initHeader(70)
        init()
    })

    onMounted(async() => {
        watch(() => Window.scrollPosition, (n) => {
            let position = Window.windowHeight - 500
            crl.value.bottomInput = (n > position)
        })
        try {
            let where
            if (user.isLogin) {
                where = `public == true || sender == '${user.userInfo._id}'`
            } else {
                where = 'public == true'
            }
            const messages = await db.collection('messages').where(where).getTemp()
            const nickname = await db.collection('uni-id-users').field('_id,nickname').getTemp()

            await db.collection(messages, nickname)
                .orderBy('_id', 'desc').get().then(res => {
                    message.value = res.result.data
                    danMuPool = message.value.filter(i => i.message.length < 50)
                    crl.value.getMessage = true
                    let watchAnimation = watch(() => atf.animation.period, (n) => {
                        if (n == 3) {
                            setTimeout(() => {
                                onShoot()
                            }, 1250)
                            nextTick(() => {
                                watchAnimation()
                            })
                        }
                    }, {
                        immediate: true
                    })
                })
        } catch (err) {
            popUps.tip(err, true)
        }
        let watchContent = watch([() => crl.value.getMessage, () => atf.animation.content], ([n1, n2]) => {
            if (n1 && n2) {
                crl.value.main = true
                crl.value.input = true
                nextTick(() => {
                    watchContent()
                })
            }
        }, {
            immediate: true
        })
    })

    onBeforeUnmount(() => {
        clearInterval(interval)
    })

    let crl = ref({
        main: false,
        input: false,
        bottomInput: false,
        myMessage: false,
        getMessage: false
    })
    let loading = ref({
        publish: false,
        delete: false
    })
    const input_value = ref('') //输入框的值

    let message = ref([])
    let pages = ref(1)

    function showMore() {
        if (pages.value * 10 > message.value.length) return
        pages.value++
    }

    let channel_count //通道数量
    let danMuPool = [] // 存放弹幕
    let hasChannel = [] //标记通道是否可用 注意：false代表可用，true代表不可以
    let spaced = 100 // 两条弹幕轨道的间隔
    let speed // 弹幕滑动的速度

    Window.$onAction(
        ({
            name, // action 名称
            store, // store 实例，类似 `someStore`
            args, // 传递给 action 的参数数组
            after, // 在 action 返回或解决后的钩子
            onError, // action 抛出或拒绝的钩子
        }) => {
            if (name == 'changeWindow') {
                after(() => {
                    init()
                })
            }
        })

    function init() {
        channel_count = Math.floor((Window.windowHeight * 0.7 - 60) / spaced)
        speed = Math.floor(Math.sqrt(Window.windowWidth) * 5)
    }

    // 获取一个可以发射弹幕的通道 没有则返回-1
    function getChannel() {
        for (let i = 0; i < channel_count; i++) {
            if (!hasChannel[i]) return i
        }
        return -1
    }
    // 根据DOM和弹幕信息 发射弹幕
    // 发射弹幕
    function shootDanMu(text, channel) {
        let wrapper = document.querySelector('.wrapper')
            // 创建DOM，并加入wrapper中
        let dom = document.createElement('span')
        wrapper.appendChild(dom)
            // 初始化css样式
        dom.className = 'init'
            // 设置轨道
        let channelPosition = channel * spaced
        dom.style.transform = `translateY(${channelPosition}px)`
            // 当动画结束时销毁DOM
        dom.addEventListener('transitionend', () => {
                danMuPool.push(text)
                wrapper.removeChild(dom)
            })
            // 给DOM加入弹幕信息
        dom.innerText = `${text.sender[0].nickname}:${text.message}`
            // 给DOM设置相应的背景颜色
        let color = danMuColor(text.sender[0]._id)
        dom.style.background = color
            // 根据弹幕长度设置动画时间，保证弹幕划过的速度相同
        let time = (document.documentElement.clientWidth + dom.offsetWidth) / speed
        dom.style.transition = `${time}s linear`;
        // 根据弹幕长度设置，弹幕位移的最终位置，并在0.1s后发射弹幕
        setTimeout(() => {
            dom.style.left = `${-dom.offsetWidth}px`;
        }, 100);
        // 禁止该轨道发射弹幕
        // 并在弹幕完全划出屏幕后的0.5s再开放轨道
        hasChannel[channel] = true;
        setTimeout(() => {
            hasChannel[channel] = false;
        }, (dom.offsetWidth / speed + 0.6) * 1000);
    }

    function danMuColor(sender) {
        if (user.isLogin && sender == user.userInfo._id)
            return document.documentElement.style.getPropertyValue('--color-theme-2')
        return document.documentElement.style.getPropertyValue('--color-theme-1')
    }

    let interval

    function onShoot() {
        // 每隔10ms从弹幕池里获取弹幕（如果有的话）并发射
        interval = setInterval(() => {
            let channel;
            if (danMuPool.length && (channel = getChannel()) != -1) {
                let i = Math.floor(danMuPool.length * Math.random())
                let danMu = danMuPool.splice(i, 1)
                shootDanMu(danMu[0], channel);
            }
        }, 10);
    }

    // 发送留言
    async function publish(msg) {
        // return console.log(msg)
        if (!user.isLogin) return popUps.callPopUps(['login'])
        try {
            uni.showLoading({
                mask: true
            })
            loading.publish = true
            await db.collection('messages').add({
                message: msg
            }).then(res => {
                let data = {
                    _id: res.result.id,
                    message: msg,
                    sender: [{
                        _id: user.userInfo._id,
                        nickname: user.userInfo.nickname
                    }],
                    createdAt: Date.now(),
                    public: true
                }
                message.value.unshift(data)
                if (data.message.length < 50) danMuPool.unshift(data)
                popUps.tip('发布成功', false)
                inputData.message = ''
            })
        } catch (err) {
            popUps.tip(err, true)
        } finally {
            loading.publish = false
            uni.hideLoading()
        }
    }

    //删除留言
    async function deleteMessage(msg) {
        message.value.splice(message.value.indexOf(msg), 1)
    }
</script>

<template>
  <div>
    <div class="dm-container">
      <div class="wrapper"></div>
      <!-- 输入款 -->
      <transition @publish="publish" name="fade">
        <input-ups :position="true" :loading="loading.publish" class="input-danmu" v-show="crl.input"></input-ups>
      </transition>
    </div>
    <!-- 底部输入框 -->
    <transition @publish="publish" name="fade">
      <input-ups :position="false" :loading="loading.publish" class="input-bottom" v-show="crl.bottomInput"></input-ups>
    </transition>
    <div class="pageContainer">
      <transition name="blur" style="--active-enter-time:0.75s ease-out">
        <div class="flex column a-c car" v-show="crl.main">
          <h2 class="title">留言板</h2>
          <div class="buts flex">
            <button class="but" :class="!crl.myMessage?'but-f':'but-t pointer'"
              @click="crl.myMessage=false">全部留言</button>
            <button class="but" :class="crl.myMessage?'but-f':'but-t pointer'" @click="user.isLogin?crl.myMessage=true
            :popUps.callPopUps(['login'])">我的留言</button>
          </div>
          <p class="op-5">tip</p>
          <p class="op-5">留言超过50字将不会在弹幕中显示</p>
          <p class="op-5" style="margin-bottom: 10px;">留言有500字的最大限度</p>
        </div>
      </transition>
      <TransitionGroup name="list">
        <div class="comments car" v-for="(item, index) in message" :key="item._id" v-if="crl.main"
          v-show="crl.myMessage?item.sender[0]._id == user.userInfo._id:index<pages*10">
          <msg :data="item" @deleteMessage="deleteMessage(item)"></msg>
        </div>
      </TransitionGroup>
      <transition name="blur" style="--active-enter-time:0.75s ease-out">
        <div class="car bottom" @click="showMore" :class="pages* 10 > message.length?'op-5':'luminousBox'"
         v-if="!crl.myMessage&&crl.getMessage&&crl.main">
            <h4 :class="pages* 10 > message.length?'':'pointer bottom-h'"
            >{{pages* 10 > message.length?'到底了~~':'点击加载更多'}}</h4>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .dm-container {
        position: absolute;
        top: 0;
        width: 100%;
        height: 70vh;
        transition: 1s;
        overflow: hidden;
    }
    
    .wrapper {
        position: absolute;
        top: 60px;
        width: 100%;
        height: calc(100% - 60px);
        z-index: 1;
    }
    
    .input-bottom {
        position: fixed;
        width: 100%;
        bottom: 30px;
        z-index: 5;
    }
    
    .input-danmu {
        position: absolute;
        height: 95%;
        width: 100%;
        top: 30px;
    }
    
    .title {
        margin-top: 10px;
        padding: 15px;
    }
    
    .buts {
        width: 80%;
        height: 45px;
        max-width: 500px;
        margin-bottom: 20px;
        justify-content: space-between;
    }
    
    .but {
        width: 40%;
        font-size: 16px;
        border-radius: 75px;
        transition: 0.75s;
        letter-spacing: 5px;
    }
    
    .but-f {
        border: 0;
        background: var(--color-theme-1);
        color: var(--color-but-font);
    }
    
    .but-t {
        border: 1px solid var(--color-wait);
        color: var(--color-font);
        background: none;
    }
    
    .comments {
        width: 100%;
        padding: 10px 0;
        margin: 20px 0;
    }
    
     :global(.init) {
        position: absolute;
        left: 100%;
        border-radius: 75px;
        opacity: 0.8;
        white-space: nowrap;
        padding: 10px;
        color: var(--color-but-font);
    }
    
    .bottom {
        height: 60px;
        width: 100%;
        line-height: 60px;
        transition: 0.75s;
        text-align: center;
    }
    
    .bottom-h {
        transition: 0.75s;
    }
    
    .bottom-h:hover {
        color: var(--color-but-font);
    }
</style>