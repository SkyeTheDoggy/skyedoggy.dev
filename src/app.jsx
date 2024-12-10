import { Router, getCurrentUrl, Route } from 'preact-router';
import { createHashHistory } from 'history';
import { useEffect, useState } from 'preact/hooks';
import AnimatedBG from './components/animated_bg.jsx';
import paw from './assets/paw.svg';
import './app.scss';
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  apiHost: 'https://plausible.skyedoggy.dev',
  domain: 'skyedoggy.dev',
  hashMode: true
})
plausible.enableAutoOutboundTracking()
plausible.enableAutoPageviews()

import menuIcon from './assets/icons/menu.svg';
import menuCloseIcon from './assets/icons/menu_close.svg';

import WIP from './pages/WIP.jsx';
import Home from './pages/Home.jsx';
import Repos from './pages/Repos.jsx';
import NotFound from './pages/NotFound.jsx';
import Contact from './pages/Contact.jsx';

const routes = [
  { name: 'Home', path: '/', component: Home },
  { name: 'GitHub Repos', path: '/repos', component: Repos },
  { name: 'Contact', path: '/contact', component: Contact },
  { name: 'My Artworks', path: '/artworks', component: WIP },
  { name: 'My Waifus', path: '/waifus', component: WIP },
];

export function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentUrl());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [navStatus, setNavStatus] = useState(isMobile ? 'closed' : 'open');

  useEffect(() => {
    const updateMobileStatus = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener('resize', updateMobileStatus);
    return () => window.removeEventListener('resize', updateMobileStatus);
  }, []);

  const handleRoute = (e) => {
    setCurrentPath(e.url);
    if (routes.some(p => p.path === e.url)) {
      plausible.trackPageview()
    } else {
      plausible.trackEvent('not-found-pages', { props: { url: e.url } })
    }
  };

  const activeRoute = routes.find(route => route.path === currentPath);
  const routeName = activeRoute ? activeRoute.name : 'Not Found';

  return (
    <>
      <a href="#main" class="skip-to-content" tabIndex={1}>Skip to main content</a>
      <AnimatedBG />
      <div className="container">
        <div className={`nav ${navStatus}`}>
          <div className="topbar">
            <div className="title">
              <img
                src={navStatus === 'open' ? menuCloseIcon : menuIcon}
                className="navToggle icon"
                alt="nav toggler"
                onClick={() => setNavStatus(prev => (prev === 'open' ? 'closed' : 'open'))}
              />
              <img draggable={false} src={paw} alt="paw logo" />
              <span>
                <span className="domainName">
                  <span className="skye">Skye</span>
                  <span className="doggy">Doggy</span>
                </span>
                <span className="tld">.dev</span>
              </span>
            </div>
          </div>
          <ul className="list">
            {routes.map(({ name, path }) => (
              <a
                key={path}
                tabIndex={1}
                className="item"
                href={path}
                aria-selected={path === currentPath}
                onClick={() => {
                  if (isMobile) setNavStatus('closed');
                }}
              >
                {name}
              </a>
            ))}
          </ul>
        </div>
        <div className="content">
          <div className="topbar">
            <span className="title">
              <img
                src={navStatus === 'open' ? menuCloseIcon : menuIcon}
                className="navToggle icon"
                alt="nav toggler"
                onClick={() => setNavStatus(prev => (prev === 'open' ? 'closed' : 'open'))}
              />
              <span>{routeName}</span>
            </span>
          </div>
          <div className="mainContent" id="main">
            <Router history={createHashHistory()} onChange={handleRoute}>
              {routes.map(({ path, component }) => (
                <Route path={path} component={component} />
              ))}
              <Route default component={NotFound} />
            </Router>
          </div>
        </div>
      </div>
    </>
  );
}
