<script setup>
    const uniIdCo = uniCloud.importObject('uni-id-co', {
        customUI: true // 取消自动展示的交互提示界面
    })
    import {
        ref,
        onMounted,
        computed,
        watch,
        onBeforeMount,
        onBeforeUnmount,
        nextTick
    } from 'vue'
    import cf from '/utils/cf.js'
    import md5 from 'js-md5'
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()

    onBeforeMount(() => {
        if (user.isLogin) {
            change('Reset')
            setTimeout(() => {
                account.value.email = user.userInfo.email
            }, 560)
        }
    })

    onMounted(() => {
        mask.value = true
        codeWait('RegCode')
        codeWait('ResCode')
        window.addEventListener('keydown', keyDown)
            // watch([() => loading.value.accountAction, () => account.value.title], ([l, t]) => {
            //     account.value.butText = l ? butText.loading[t] : butText[t]
            // }, {
            //     immediate: true
            // })
    })
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', keyDown, false)
    })

    function keyDown(e) { // 回车触发
        if (e.keyCode != 13) return
        if (captchaUps.value) return getCode()
        accountAction()
    }

    function exit() {
        mask.value = false
        setTimeout(() => {
            popUps.shutPopUps()
        }, 500)
    }

    function change(to) {
        if (loading.value.accountAction) return
        if (to != 'Login') {
            if (to == 'Reset') {
                changeDrt.value = 'changeL'
                setTimeout(() => {
                    changeDrt.value = 'changeR'
                }, 600)
            } else {
                changeDrt.value = 'changeR'
                setTimeout(() => {
                    changeDrt.value = 'changeL'
                }, 600)
            }
        }
        account.value.display = false
        setTimeout(() => {
            account.value = {
                ...init
            }
            account.value.title = to
        }, 550)
    }
    const changeDrt = ref('fade')

    // 验证码等待
    function codeWait(type) {
        let createdAt = localStorage.getItem(type)
        let waitTime = -Math.ceil((Date.now() - createdAt) / 1000 - 61)
        let codeInterval
        if (waitTime >= 0) {
            loading.value[type] = true
            codeInterval = setInterval(() => {
                waitTime--
                account.value[type] = waitTime + '：验证码已发送'
                if (waitTime < 0) {
                    account.value[type] = '获取验证码'
                    loading.value[type] = false
                    clearInterval(codeInterval)
                }
            }, 1000);
        }
    }

    let butText = ref({
        Login: '登陆',
        Register: '注册',
        Reset: '重置',
        loading: {
            Login: '登陆中...',
            Register: '信息提交中...',
            Reset: '信息提交中...',
        }
    })

    let loading = ref({
        RegCode: false,
        ResCode: false,
        getCode: false,
        accountAction: false
    })

    const captchaImg = ref('') //图形验证码图片
    const captchaUps = ref(false) //图形验证码窗口
    const captchaInput = ref('') //图形验证码窗口输入内容
    const mask = ref(false) //背景遮罩
    const codeTpye = computed(() => {
        return account.value.title.slice(0, 3) + 'Code'
    })
    let account = ref({
        display: true,
        title: "Login",
        email: '',
        password: '',
        showPassword: false,
        nickname: '',
        code: '',
        RegCode: '获取验证码',
        ResCode: '获取验证码',
        butText: ''
    })
    let init = {
        ...account.value
    }

    // 检查邮箱合法性
    function checkEmail() {
        let regex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        return regex.test(account.value.email)
    }

    // 打开人机交互验证
    async function openCaptcha() {
        if (!checkEmail()) return popUps.tip('邮箱格式不合法', true)
        await Captcha('createCaptcha')
        captchaUps.value = true
    }

    // 创建、更新图形验证码
    async function Captcha(type) {
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        await uniIdCo[type]({
            scene: 'send-email-code'
        }).then(res => {
            captchaImg.value = res.captchaBase64
        })
        uni.hideLoading()
    }

    // 退出人机交互验证
    function exitCaptcha() {
        captchaUps.value = false
        captchaInput.value = ''
    }

    // 获取邮箱验证码
    async function getCode() {
        if (loading.value.getCode) return
        let scene = (account.value.title == 'Register') ? 'register' : 'reset-pwd-by-email'
        loading.value.getCode = true
        await cf('code', {
            email: account.value.email,
            scene,
            captcha: captchaInput.value
        }, 'visitor').then(res => {
            localStorage.setItem(codeTpye.value, Date.now())
            codeWait(codeTpye.value)
            popUps.tip(res.message, false)
            exitCaptcha()
        }).catch(res => {
            popUps.tip(res, true)
            Captcha('refreshCaptcha')
        })
        loading.value.getCode = false
    }

    const actionList = {
        // 注册
        Register: async function(data) {
            let user = await uniCloud.database()
                .collection('uni-id-users')
                .where({
                    nickname: data.nickname
                })
                .field('nickname').get()
            if (user.result.data[0]) throw Error('该昵称已被使用')
            return await uniIdCo.registerUserByEmail(data)
        },

        // 登陆
        Login: async function(data) {
            return await uniIdCo.login(data)
        },

        // 重置密码
        Reset: async function(data) {
            await uniIdCo.resetPwdByEmail(data)
            return Login(data)
        }
    }

    // 用户行为入口函数（注册、登陆、重置密码）
    async function accountAction() {
        try {
            if (loading.value.accountAction) return
            loading.value.accountAction = true
            uni.hideKeyboard()
            uni.showLoading({
                mask: true
            })
            await actionList[account.value.title]({
                email: account.value.email,
                password: md5(account.value.password),
                code: account.value.code,
                nickname: account.value.nickname
            })
            user.signIn()
            exit()
            throw 0
        } catch (err) {
            popUps.tip(err ? err : `${butText.value[account.value.title]}成功`, Boolean(err))
        } finally {
            uni.hideLoading()
            loading.value.accountAction = false
        }
    }
</script>

<template>
  <transition name="fade">
    <div class="full flex j-c a-c position-f" v-show="mask">
      <transition name="fade">
        <div v-show="captchaUps" class="full position-a flex a-c j-c" style="z-index: 9;">
          <transition name="zoom" style="--active-width:240px;--active-height:260px;--active-blur:blur(10px);">
            <div v-if="captchaUps" class="captcha car flex column a-c">
              <uni-icons @click="exitCaptcha" class="exit pointer" type="closeempty" size="20"
                color="var(--color-font)">
              </uni-icons>
              <h3 style="transform: translateY(-5px);word-wrap: normal;">人机验证</h3>
              <image @click="Captcha('refreshCaptcha')" class="pointer" :src="captchaImg"
                style="width: 150px; height: 50px;">
              </image>
              <input type="text" v-model="captchaInput">
              <button @click="getCode" class="luminousBox" :class="loading.getCode?'op-5':'pointer'">确定</button>
            </div>
          </transition>
        </div>
      </transition>
      <transition :name="changeDrt">
        <div class="login car position-r flex column a-c" v-show="account.display">
          <uni-icons @click="exit" class="exit pointer" type="closeempty" size="20" color="var(--color-font)">
          </uni-icons>
          <p class="title">{{account.title}}</p>
          <div class="inputs flex column a-c">
            <div class="input flex" :class="{'adjust':account.title==='Login'}">
              <p class="el">账号：</p>
              <input placeholder="邮箱号" v-model='account.email'>
            </div>
            <div class="input flex">
              <p class="el">{{account.title==='Reset'?'新密码:':'密码：'}}</p>
              <input :type="account.showPassword?'':'password'" style="width: 165px;" v-model='account.password'>
              <p class="showPassword pointer" @click="account.showPassword = !account.showPassword">
                {{account.showPassword?'隐藏':'显示'}}
              </p>
            </div>
            <div class="input flex" v-if="account.title==='Register'">
              <p class="el">昵称：</p>
              <input v-model="account.nickname">
            </div>
            <div class="input flex" v-if="account.title==='Register'||account.title==='Reset'">
              <p class="el">验证码:</p>
              <input v-model="account.code">
            </div>
          </div>
          <div class="buts flex column a-c">
            <!-- 获取验证码按钮 -->
            <button class="but but-code"
              :class="account.title==='Reset'?loading.ResCode?'op-5':'pointer luminousBox':loading.RegCode?'op-5':'pointer luminousBox'"
              v-if="account.title==='Register'||account.title==='Reset'"
              @click="openCaptcha">{{account.title==='Reset'?account.ResCode:account.RegCode}}</button>
            <!-- 登陆、注册按钮 -->
            <button class="but but-theme" :class="loading.accountAction?'op-5':'pointer'"
              @click="accountAction">{{loading.accountAction?butText.loading[account.title]:butText[account.title]}}</button>
          </div>
          <!-- 切换按钮 -->
          <div class="options flex" v-if="account.title==='Login'">
            <span @click="change('Reset')" class="pointer">密码找回</span>
            <span @click="change('Register')" class="pointer">注册</span>
          </div>
          <uni-icons @click="change('Login')" class="pointer" type="arrow-right" size="35"
            :class="{'rollback':account.title==='Register'}" style="margin-top: 5px;"
            v-if="user.isLogin?false:account.title==='Register'||account.title==='Reset'" color="var(--color-font)">
          </uni-icons>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
    @import '/pages/main.css';
    .full {
        transform-style: preserve-3d;
        perspective: 850px
    }
    
    .login {
        width: 350px;
        height: 600px;
    }
    
    .exit {
        margin: 20px 0 0 20px;
        align-self: start;
    }
    
    .cls-exit {
        fill: var(--color-wait);
    }
    
    .title {
        margin: 25px 0 30px 0;
        font-size: 55px;
    }
    
    .inputs {
        width: 100%;
        height: 250px;
        justify-content: space-around;
    }
    
    .input {
        background: var(--color-background-input);
        padding: 5px;
        width: 75%;
        border-radius: 75px;
        padding: 11px;
    }
    
    .adjust {
        transition: 0s;
        transform: translateY(30px);
    }
    
    .input input {
        width: 200px;
        background: none;
        border-radius: 0;
        outline: none;
        font-size: 15px;
        margin-right: 10px;
        border: 0;
        border-bottom: 1px solid var(--color-wait);
    }
    
    .input .el {
        text-align: end;
        width: 55px;
        white-space: nowrap;
    }
    
    .showPassword {
        position: relative;
        width: 0;
        white-space: nowrap;
    }
    
    .buts {
        width: 100%;
        height: 130px;
        justify-content: space-around;
    }
    
    .but {
        width: 75%;
        height: 45px;
        font-size: 15px;
        letter-spacing: 5px;
        border-radius: 75px;
    }
    
    .but-code {
        border: 1px solid var(--color-line);
        color: var(--color-font);
        background: none;
    }
    
    .but-code:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .but-theme {
        background: var(--color-theme-1);
        border: 1px solid var(--color-theme-1);
        color: var(--color-but-font);
    }
    
    .options {
        justify-content: space-between;
        width: 75%;
    }
    
    .rollback {
        transform: rotate(180deg);
    }
    
    .captcha {
        z-index: 10;
    }
    
    .captcha>* {
        margin: 10px 20px;
        word-wrap: normal;
    }
    
    .captcha>input {
        border-bottom: 1px solid var(--color-line);
        background-color: var(--color-background-box);
        width: 100px;
    }
    
    .captcha>button {
        width: 200px;
        height: 40px;
        font-size: 15px;
        letter-spacing: 5px;
        background: none;
        border-radius: 50px;
        color: var(--color-font);
        border: 1px solid var(--color-line);
    }
    
    .captcha>button:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .changeR-enter-active,
    .changeL-enter-active {
        transition: 0.5s ease-out;
    }
    
    .changeR-leave-active,
    .changeL-leave-active {
        transition: 0.5s ease-in;
    }
    
    .changeR-enter-from {
        transform: rotateY(-90deg);
    }
    
    .changeL-enter-from {
        transform: rotateY(90deg);
    }
    
    .changeR-enter-to,
    .changeL-enter-to {
        transform: rotateY(0deg);
    }
    
    .changeR-leave-form,
    .changeL-leave-form {
        transform: rotateY(0deg);
    }
    
    .changeR-leave-to {
        transform: rotateY(90deg);
    }
    
    .changeL-leave-to {
        transform: rotateY(-90deg);
    }
</style>