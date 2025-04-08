import { Marked } from "marked";
import { useEffect, useState } from "preact/hooks";
import '../styles/markdown.scss';
import twemoji from '../assets/twemoji/';
import renderToString from 'preact-render-to-string';
import SkeletonText from "../components/SkeletonText.jsx";

const docsConfigs = {
    repo: 'SkyeUwU/skyedoggy.dev',
    branch: 'docs',
    md_file: 'homeinfo.md'
}

const docsBase = `https://raw.githubusercontent.com/`
const docsRepoBase = new URL(`${docsConfigs.repo}/refs/heads`, docsBase).toString()
const docsBranchBase = `${docsRepoBase}/${docsConfigs.branch}`
const docsMdFile = `${docsBranchBase}/${docsConfigs.md_file}`

const marked = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
        link(args) {
            const allowedHosts = [
                new RegExp(`^${window.location.hostname.replace(/\./g, '\\.')}$`),
                /^discord\.skyedoggy\.dev$/
            ];

            const hrefHost = new URL(args.href, `${location.protocol}//${location.host}`).hostname.split(':')[0];
            const rel = allowedHosts.some(host => host.test(hrefHost)) ? '' : 'noopener noreferrer';
            const target = allowedHosts.some(host => host.test(hrefHost)) ? '' : '_blank';

            return renderToString(
                <a target={target} rel={rel} href={args.href} title={args.title || ''}>
                    {args.text || args.href}
                </a>
            );
        },
        image(args) {
            const href = args.href
                ? new URL(args.href, docsBranchBase).toString()
                : ''
            return renderToString(<img
                src={href}
                alt={args.text || 'image'}
                title={args.title || ''}
            />)
        },
        html(args) {
            const body = document.createElement('body')
            body.innerHTML = args.raw
            const childs = body.querySelectorAll('*')
            
            childs.forEach(child => {
                if (child.tagName == 'IMG') {
                    if (child.src && child.src.trim()) {
                        const uri = new URL(child.src)
                        const hostname = uri.host
                        const base = hostname === window.location.host ? docsBranchBase : hostname
                        const path = uri.pathname
                        child.src = `${base}${path}`
                    }
                }
            })

            return body.innerHTML
        }
    }
})

export default () => {
    const [isLoading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [infoMD, setInfoMD] = useState(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        let timeout = setTimeout(() => {
            if (isLoading === null) setLoading(true)
        }, 20)

        const get = async () => {
            try {
                const response = await fetch(docsMdFile)
                const text = await response.text()

                setInfoMD(text)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
                clearTimeout(timeout)
                setTimeout(() => { setAnimate(true) }, 20)
            }
        }
        get()

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    if (isLoading === null) return
    if (isLoading === true) return <SkeletonText lines={20} />

    return <div className={`homePageContainer introAnimated ${animate ? 'shown' : ''}`}>
        <div className="md" dangerouslySetInnerHTML={{
            __html: twemoji.parse(marked.parse(infoMD), {
                folder: 'svg',
                ext: '.svg'
            })
        }}></div>
    </div>
}