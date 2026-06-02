import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallViewport = window.matchMedia('(max-width: 767px)').matches;

function setFinalState() {
  gsap.set(
    '.reveal, .batch-reveal, [data-hero-line] span, [data-hero-kicker], [data-hero-copy], [data-hero-cta], [data-hero-signal], [data-hero-core], [data-hero-chip], [data-hero-capability]',
    { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'transform' },
  );
  gsap.set('[data-hero-path], [data-hero-ring]', { strokeDashoffset: 0 });
}

function initHero() {
  const scene = document.querySelector('[data-hero-scene]');
  if (!scene) return;

  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line] span');
  const kickers = gsap.utils.toArray<HTMLElement>('[data-hero-kicker]');
  const chips = gsap.utils.toArray<HTMLElement>('[data-hero-chip]');
  const paths = gsap.utils.toArray<SVGPathElement>('[data-hero-path], [data-hero-ring]');
  const signals = gsap.utils.toArray<HTMLElement>('[data-hero-signal]');
  const capabilities = gsap.utils.toArray<HTMLElement>('[data-hero-capability]');

  gsap.set(lines, { yPercent: 112, rotateX: -28, transformOrigin: 'left bottom' });
  gsap.set(kickers, { opacity: 0, y: -18 });
  gsap.set('[data-hero-copy], [data-hero-cta]', { opacity: 0, y: 30 });
  gsap.set('[data-hero-core]', { opacity: 0, scale: 0.72, rotate: -2 });
  gsap.set(chips, { opacity: 0, scale: 0.78, y: 18 });
  gsap.set(signals, { opacity: 0, y: 16 });
  gsap.set(capabilities, { opacity: 0, y: 18 });
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });

  const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

  timeline
    .to(kickers, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 })
    .to(lines, { yPercent: 0, rotateX: 0, duration: 0.86, stagger: 0.1 }, '-=0.12')
    .to(paths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.08, ease: 'power2.inOut' }, '-=0.62')
    .to('[data-hero-core]', { opacity: 1, scale: 1, rotate: 0, duration: 0.72, ease: 'back.out(1.25)' }, '-=0.72')
    .to(chips, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.045, ease: 'back.out(1.55)' }, '-=0.42')
    .to('[data-hero-copy]', { opacity: 1, y: 0, duration: 0.62 }, '-=0.4')
    .to(signals, { opacity: 1, y: 0, duration: 0.42, stagger: 0.055 }, '-=0.34')
    .to('[data-hero-cta]', { opacity: 1, y: 0, duration: 0.44, stagger: 0.06 }, '-=0.22')
    .to(capabilities, { opacity: 1, y: 0, duration: 0.38, stagger: 0.045 }, '-=0.35');

  chips.forEach((chip, index) => {
    const driftY = isSmallViewport ? 4 : 10;
    const driftX = isSmallViewport ? 3 : 8;
    gsap.to(chip, {
      y: index % 2 === 0 ? -driftY : driftY,
      x: index % 3 === 0 ? driftX : -driftX,
      rotate: index % 2 === 0 ? 0.8 : -0.8,
      duration: 3.5 + index * 0.18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1 + index * 0.05,
    });
  });

  gsap.to('[data-hero-ring]', {
    rotate: 360,
    transformOrigin: 'center',
    duration: 42,
    repeat: -1,
    ease: 'none',
  });

  if (!isSmallViewport) {
    gsap.to('[data-hero-system]', {
      y: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) {
    setFinalState();
    return;
  }

  document.documentElement.classList.add('motion-ready');

  initHero();

  const heroWords = gsap.utils.toArray<HTMLElement>('[data-hero-title] span');
  heroWords.forEach((word) => word.classList.add('hero-word'));

  if (heroWords.length > 0) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(heroWords, { opacity: 1, y: 0, duration: 0.8, stagger: 0.055 })
      .to('.reveal', { opacity: 1, y: 0, duration: 0.75, stagger: 0.08 }, '-=0.45');
  } else {
    gsap.to('.reveal', { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out', delay: 0.25 });
  }

  ScrollTrigger.batch('.batch-reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      });
    },
  });

  gsap.utils.toArray<HTMLElement>('.parallax-media').forEach((element) => {
    gsap.to(element, {
      yPercent: -4,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations, { once: true });
} else {
  initAnimations();
}

document.addEventListener('astro:before-swap', cleanupAnimations);
document.addEventListener('astro:page-load', initAnimations);
