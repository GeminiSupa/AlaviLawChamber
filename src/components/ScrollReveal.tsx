'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Smart Function to find and observe elements
    const observeNewElements = () => {
      const revealElements = document.querySelectorAll(
        '.reveal:not(.observed), .reveal-left:not(.observed), .reveal-right:not(.observed), .reveal-scale:not(.observed)'
      );
      revealElements.forEach((el) => {
        el.classList.add('observed');
        observer.observe(el);
      });
    };

    // Run once immediately
    observeNewElements();

    // Watch for new elements being added to the page (like when blogs load)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
