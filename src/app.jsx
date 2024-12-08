import { Router, getCurrentUrl, Route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import AnimatedBG from './components/animated_bg.jsx';
import paw from './assets/paw.svg';
import './app.scss';

import menuIcon from './assets/icons/menu.svg'
import menuCloseIcon from './assets/icons/menu_close.svg'

import WIP from './pages/WIP.jsx';
import Home from './pages/Home.jsx';
import Repos from './pages/Repos.jsx';
import NotFound from './pages/NotFound.jsx';
import Contact from './pages/Contact.jsx';

const routeNames = [
  { name: 'Home', route: '/' },
  { name: 'GitHub Repos', route: '/repos' },
  { name: 'Contact', route: '/contact' },
  { name: 'My Artworks', route: '/artworks' },
  { name: 'My Waifus', route: '/waifus' },
];

export function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentUrl());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [navStatus, setNavStatus] = useState(isMobile ? 'closed' : 'open');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMobile(window.innerWidth <= 800);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleRoute = (e) => {
    setCurrentPath(e.url);
  };

  const activeRoute = routeNames.find(route => route.route === currentPath);
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
            {routeNames.map(route => (
              <a
                key={route.route}
                tabIndex={1}
                className="item"
                href={route.route}
                aria-selected={route.route === currentPath}
                onClick={() => {
                  if (isMobile) setNavStatus('closed');
                }}
              >
                {route.name}
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
            <Router onChange={handleRoute}>
              <Route path="/" component={Home} />
              <Route path="/repos" component={Repos} />
              <Route path="/contact" component={Contact} />
              <Route path="/artworks" component={WIP} />
              <Route path="/waifus" component={WIP} />
              <Route default component={NotFound} />
            </Router>
          </div>
        </div>
      </div>
    </>
  );
}
