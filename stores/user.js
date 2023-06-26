import {
    defineStore
} from 'pinia'
import {
    ref
} from 'vue'

const init = { //初始化用户信息
    _id: null,
    nickname: null,
}

export const useUserStore = defineStore('user', () => {
    const isLogin = ref(false) //是否登陆
    const isAdmin = ref(false) //是否为管理员
    const link = ref({})
    const userInfo = ref({ //用户信息
        ...init
    })

    async function signIn() {
        let user = uniCloud.getCurrentUserInfo()
        if (!user.uid) return
        if (user.tokenExpired - Date.now() < 600000) return this.signOut()
        this.isLogin = true
        if (user.role.some(i => i == 'admin')) this.isAdmin = true
        this.userInfo._id = user.uid
        await uniCloud.database()
            .collection('uni-id-users')
            .doc(user.uid)
            .field('email,nickname,link')
            .get().then(res => {
                this.userInfo = {
                    ...res.result.data[0]
                }
            })
    }

    function signOut() {
        this.isLogin = false
        this.isAdmin = false
        localStorage.removeItem('uni_id_token')
        localStorage.removeItem('uni_id_token_expired')
        this.data = {
            ...init
        }
    }

    return {
        isLogin,
        isAdmin,
        link,
        userInfo,
        signIn,
        signOut
    }
})