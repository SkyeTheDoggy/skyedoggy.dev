import { Marked } from "marked";
import { useEffect, useState } from "preact/hooks";
import '../styles/markdown.scss';
import twemoji from '../assets/twemoji';
import renderToString from 'preact-render-to-string';
import SkeletonText from "../components/SkeletonText.jsx";

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
                const response = await fetch('https://cdn.skyedoggy.dev/homeinfo.md')
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