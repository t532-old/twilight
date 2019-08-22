import MarkdownIt from 'markdown-it'
import Katex from 'katex'

const md = new MarkdownIt({
    highlight(str, lang) {
        return `<pre>${str}</pre>`
    }
})
export default function render(raw) {
    return md
        .render(raw)
        .replace(/\$\$(.+?)\$\$/g, (_, str) =>
            Katex.renderToString(str, { throwOnError: false, displayMode: true }))
        .replace(/\$(.+?)\$/g, (_, str) =>
            Katex.renderToString(str, { throwOnError: false, displayMode: false }))
}
