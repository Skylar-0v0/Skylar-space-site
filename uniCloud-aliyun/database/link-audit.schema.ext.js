const db = uniCloud.database()
module.exports = {
    trigger: {
        beforeUpdate: async function({
            userInfo
        } = {}) {
            console.log(userInfo.role)
            if (userInfo.role.some(i => i == 'admin')) return
            uniCloud.callFunction({
                name: 'blog-skylar',
                type: 'fun',
                data: {
                    api: 'linkAudit',
                    args: {
                        id: userInfo.uid
                    }
                }
            })
        },
        beforeCreate: async function({
            collection,
            operation,
            userInfo,
            addDataList
        } = {}) {
            if (addDataList.length > 1) throw Error('禁止批量增加')
            let res = await db.collection('link-audit').doc(userInfo.uid).get()
            if (res.data[0]) throw Error("友情链接已存在")
        },
        afterCreate: async function({
            collection,
            operation,
            userInfo,
            clientInfo
        } = {}) {
            const dbJQL = uniCloud.databaseForJQL({
                clientInfo,
                skipTrigger: true // true跳过执行触发器，false则继续执行触发器。默认为false
            })
            let res = await dbJQL.collection('uni-id-users').doc(userInfo.uid).update({
                link: true
            })
        },
        afterDelete: async function({
            collection,
            operation,
            userInfo,
            clientInfo
        } = {}) {
            const dbJQL = uniCloud.databaseForJQL({
                clientInfo,
                skipTrigger: true // true跳过执行触发器，false则继续执行触发器。默认为false
            })
            await dbJQL.collection('uni-id-users').doc(userInfo.uid).update({
                link: false
            })
            await db.collection('link').doc(userInfo.uid).remove()
        }
    }
}