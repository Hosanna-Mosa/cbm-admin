export function initScrollReveal() {
  if (typeof window === 'undefined') return;

  const selectors = [
    'h1','h2','h3','h4','h5','h6',
    'p','li','dt','dd','blockquote'
  ];

  const elements = Array.from(
    document.querySelectorAll(selectors.join(', '))
  ) as HTMLElement[];

  elements.forEach((el) => {
    if (!el.classList.contains('reveal-up')) {
      el.classList.add('reveal-up');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.classList.add('revealed');
          observer.unobserve(target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
}


