import { render } from 'preact';
import './index.scss';
import { App } from './app.jsx';

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const addEvent = (summaryElement) => {
                        summaryElement.addEventListener('click', () => {
                            setTimeout(() => {
                                const detailsElement = summaryElement.parentNode;
                                const isOpen = detailsElement.hasAttribute('open');

                                if (isOpen) {
                                    const parentContainer = detailsElement.parentNode;

                                    const parentRect = parentContainer.getBoundingClientRect();
                                    const elementRect = detailsElement.getBoundingClientRect();

                                    const isOverflowing = (
                                        Math.abs(elementRect.bottom - parentRect.bottom) > 1 ||
                                        Math.abs(elementRect.top - parentRect.top) > 1
                                    );

                                    if (isOverflowing) {
                                        detailsElement.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'nearest'
                                        });
                                    }
                                }
                            }, 10);
                        });
                    };

                    if (node.tagName === 'SUMMARY') {
                        addEvent(node);
                    }
                    node.querySelectorAll('summary').forEach(addEvent);
                }
            });
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });

render(<App />, document.getElementById('app'));
