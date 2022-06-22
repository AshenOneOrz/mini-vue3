const log = console.log.bind(console)

const bucket = new Set()

const data = {
    text: 'hello world'
}

const obj = new Proxy(data, {
    get(target, key) {
        log(target, key)
        // 读取时，将 effect 添加到存储副作用函数的桶中 
        bucket.add(effect)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        // 执行所有副作用函数
        bucket.forEach(fn => fn())
        // 返回 true 代表 set 操作成功
        return true
    }
})

const effect = () => {
    document.body.innerText = obj.text
}

effect()
