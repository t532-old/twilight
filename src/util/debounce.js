export default function debounce(fn, timeout) {
    let time = null
    return function _debounced(...args) {
        if (time !== null)
            { clearTimeout(time) }
        time = setTimeout(() => {
            fn(...args)
            time = null
        }, timeout)
    }
}
