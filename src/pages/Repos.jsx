import { useEffect, useState } from "preact/hooks";
import '../styles/repos.scss';
import licenseIcon from '../assets/icons/license.svg';
import codeIcon from '../assets/icons/code.svg'
import { formatTimestamp } from "../functions/time_format.js";

export default () => {
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(null);
    const [animate, setAnimate] = useState(false);

    const user = `SkyeUwU`
    const userURL = `https://api.github.com/users/${user}`
    const url = `${userURL}/repos?sort=pushed`;

    useEffect(() => {
        let timeout = setTimeout(() => {
            if (isLoading === null) setLoading(true)
        }, 20)

        const fetchRepos = async () => {
            try {
                const response = await fetch(url)
                const data = response.headers.get('Content-Type').split(';')[0] === 'application/json'
                    ? await response.json()
                    : await response.text();

                if (!response.ok) {
                    throw new Error(data.message || data || 'GitHub responded with an unknown error');
                }

                setRepos(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
                clearTimeout(timeout)
                setTimeout(() => { setAnimate(true) }, 20)
            }
        }
        fetchRepos()

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    if (isLoading === null) return
    if (isLoading === true) return (
        <div className="loadingSpinnerContainer reposLoadingContainer">
            <div className="spinner"></div>
        </div>
    )

    if (error) return (
        <p className="errorContainer reposErrorContainer md">
            <b>Failed to load reviews</b>
            <p><b>Error:</b> {error}</p>
        </p>
    )

    return (
        <div className="gitReposContainer">
            <div className={`gitRepotsList introAnimated ${animate ? 'shown' : ''}`}>
                {repos.map(repo => (
                    <div className="gitRepoContainer">
                        <span className="top">
                            <a
                                target="_blank"
                                href={repo.html_url}
                                className="repoName"
                                rel="noopener noreferrer"
                            >
                                {repo.name}
                            </a>
                            <span className="repoVisibility">{repo.visibility}</span>
                        </span>
                        {Boolean(repo.description) && (
                            <span className="repoDescription">{repo.description}</span>
                        )}
                        <span className="bottom">
                            {Boolean(repo.language) && <span>
                                <img src={codeIcon} className="icon" alt="language" />
                                <span className="repoLang">{repo.language}</span>
                            </span>}
                            {Boolean(repo.license) && <span>
                                <img src={licenseIcon} className="icon" alt="license" />
                                <span className="repoLicense">{repo.license.name}</span>
                            </span>}
                            {Boolean(repo.pushed_at) && <span>
                                {'Updated '}
                                <span className="repoUpdatedAt">{
                                    (() => {
                                        const under30days = (Date.now() - new Date(repo.pushed_at).getTime() < (30 * 24 * 60 * 60 * 1000))
                                        return under30days
                                            ? formatTimestamp(new Date(repo.pushed_at), 'R')
                                            : `on ${formatTimestamp(new Date(repo.pushed_at), 'D')}`
                                    })()
                                }</span>
                            </span>}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}