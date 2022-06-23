const log = console.log.bind(console)

const bucket = new WeakMap()

// 用一个全局变量存储被注册的副作用函数
let activeEffect = null

const data = {
    text: 'hello world',
}

/**
 * target
 *      -- key
 *          -- effctFunction
 */
const track = (target, key) => {
    if (!activeEffect) {
        return
    }

    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }

    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }

    deps.add(activeEffect)
}

// set 操作会触发所有绑定的 effctFunction
const trigger = (target, key) => {
    const depsMap = bucket.get(target)
    if (!depsMap) {
        return
    }

    const effects = depsMap.get(key)
    effects & effects.forEach((fn) => fn())
}

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },

    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
    },
})

const effect = (fn) => {
    activeEffect = fn
    fn()
}

const __main = () => {
    effect(() => {
        document.body.innerHTML = obj.text
    })
}

__main()
