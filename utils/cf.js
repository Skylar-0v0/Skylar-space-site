export default function cf(api, args, type) {
    return new Promise((resolve, reject) => {
        uni.showLoading()
        uniCloud.callFunction({
            name: 'blog-skylar',
            data: {
                api,
                type,
                args: {
                    ...args
                },
            }
        }).then(res => {
            uni.hideLoading()
                // console.log(res)
                // resolve(res.result)
            if (res.result.success) {
                resolve(res.result.data)
            } else {
                reject(res.result.errorMessage)
            }
        })
    })
}