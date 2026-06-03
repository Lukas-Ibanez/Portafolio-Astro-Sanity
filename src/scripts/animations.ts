import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallViewport = window.matchMedia('(max-width: 767px)').matches;

function setFinalState() {
  gsap.set(
    '.reveal, .batch-reveal, [data-hero-line-text], [data-hero-kicker], [data-hero-copy], [data-hero-cta], [data-hero-signal], [data-hero-core], [data-hero-chip], [data-hero-capability], [data-stats-intro], [data-stat-card], [data-workflow-step], [data-about-title-line], [data-about-copy], [data-about-layer], [data-skills-title-line], [data-skills-copy], [data-skill-category], [data-skill-card], [data-skill-logo], [data-skill-node]',
    { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'transform' },
  );
  gsap.set('[data-hero-path], [data-hero-ring], [data-stats-path], [data-stats-ring], [data-about-step-path], [data-skill-path]', { strokeDashoffset: 0 });
}

function initHero() {
  const scene = document.querySelector('[data-hero-scene]');
  if (!scene) return;
  const system = document.querySelector('[data-hero-system]');

  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line-text]');
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

  const introTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
  const systemTimeline = gsap.timeline({
    paused: isSmallViewport,
    defaults: { ease: 'power4.out' },
  });

  introTimeline
    .to(kickers, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 })
    .to(lines, { yPercent: 0, rotateX: 0, duration: 0.86, stagger: 0.1 }, '-=0.12')
    .to('[data-hero-copy]', { opacity: 1, y: 0, duration: 0.62 }, '-=0.4')
    .to(signals, { opacity: 1, y: 0, duration: 0.42, stagger: 0.055 }, '-=0.34')
    .to('[data-hero-cta]', { opacity: 1, y: 0, duration: 0.44, stagger: 0.06 }, '-=0.22');

  systemTimeline
    .to(paths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.08, ease: 'power2.inOut' }, '-=0.62')
    .to('[data-hero-core]', { opacity: 1, scale: 1, rotate: 0, duration: 0.72, ease: 'back.out(1.25)' }, '-=0.72')
    .to(chips, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.045, ease: 'back.out(1.55)' }, '-=0.42')
    .to(capabilities, { opacity: 1, y: 0, duration: 0.38, stagger: 0.045 }, '-=0.35');

  if (isSmallViewport && system) {
    ScrollTrigger.create({
      trigger: system,
      start: 'top 78%',
      once: true,
      onEnter: () => systemTimeline.play(0),
    });
  }

  chips.forEach((chip, index) => {
    const driftY = isSmallViewport ? 2 : 10;
    const driftX = isSmallViewport ? 2 : 8;
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

function initStats() {
  const section = document.querySelector('[data-stats-section]');
  if (!section) return;

  const intro = section.querySelector<HTMLElement>('[data-stats-intro]');
  if (!intro) return;

  const cards = gsap.utils.toArray<HTMLElement>('[data-stat-card]');
  const workflowSteps = gsap.utils.toArray<HTMLElement>('[data-workflow-step]');
  const lines = gsap.utils.toArray<SVGGeometryElement>('[data-stats-path], [data-stats-ring]');
  const number = section.querySelector<HTMLElement>('[data-stat-number]');
  const scan = section.querySelector<HTMLElement>('[data-stats-scan]');

  gsap.set(intro, { opacity: 0, y: 32 });
  gsap.set(cards, { opacity: 0, y: 34, scale: 0.94 });
  gsap.set(workflowSteps, { opacity: 0, y: 28 });

  lines.forEach((line) => {
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
  });

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 72%',
      once: true,
    },
  });

  timeline
    .to(intro, { opacity: 1, y: 0, duration: 0.68 })
    .to(lines, { strokeDashoffset: 0, duration: 1.05, stagger: 0.08, ease: 'power2.inOut' }, '-=0.42')
    .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.08 }, '-=0.58')
    .to(workflowSteps, { opacity: 1, y: 0, duration: 0.46, stagger: 0.055 }, '-=0.28');

  if (number) {
    const target = Number(number.dataset.statTarget || 0);
    const counter = { value: 0 };

    timeline.to(counter, {
      value: target,
      duration: 0.75,
      ease: 'power2.out',
      onUpdate: () => {
        number.textContent = String(Math.round(counter.value));
      },
    }, '-=0.72');
  }

  if (scan) {
    gsap.to(scan, {
      xPercent: 900,
      duration: 4.8,
      repeat: -1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });
  }
}

function initAbout() {
  const section = document.querySelector('[data-about-section]');
  if (!section) return;

  const titleLines = gsap.utils.toArray<HTMLElement>('[data-about-title-line]');
  const copy = section.querySelector<HTMLElement>('[data-about-copy]');
  const layers = gsap.utils.toArray<HTMLElement>('[data-about-layer]');
  const stepPath = section.querySelector<SVGGeometryElement>('[data-about-step-path]');
  const scan = section.querySelector<HTMLElement>('[data-about-scan]');

  if (!copy || layers.length === 0) return;

  let stepPathLength = 0;
  gsap.set(titleLines, { opacity: 0, yPercent: 92, rotateX: -16, transformOrigin: 'left bottom' });
  gsap.set(copy, { opacity: 0, y: 24 });
  if (stepPath) {
    stepPathLength = stepPath.getTotalLength();
    gsap.set(stepPath, { opacity: 1, strokeDasharray: stepPathLength, strokeDashoffset: stepPathLength });
  }

  gsap.set(layers, (index: number) => ({
    opacity: 0,
    x: -88 - index * 10,
    y: 10,
    rotate: -1.8,
    scale: 0.96,
  }));

  const timeline = gsap.timeline({
    defaults: { ease: 'power4.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 76%',
      once: true,
    },
  });

  timeline
    .to(titleLines, { opacity: 1, yPercent: 0, rotateX: 0, duration: 0.72, stagger: 0.08 })
    .to(copy, { opacity: 1, y: 0, duration: 0.54 }, '-=0.36')
    .to(layers, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.62, stagger: 0.095, ease: 'back.out(1.18)' }, '-=0.34');

  if (stepPath) {
    timeline.add(() => {
      gsap.timeline({
        repeat: -1,
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          end: 'bottom top',
          toggleActions: 'play pause resume pause',
        },
      })
        .to(stepPath, { strokeDashoffset: 0, duration: 0.9 })
        .to(stepPath, { strokeDashoffset: 0, duration: 1.5, ease: 'none' })
        .to(stepPath, { strokeDashoffset: -stepPathLength, duration: 1.45 })
        .set(stepPath, { strokeDashoffset: stepPathLength });
    }, '-=0.05');
  }

  layers.forEach((layer, index) => {
    gsap.to(layer, {
      y: index % 2 === 0 ? -8 : 8,
      rotate: index % 2 === 0 ? -0.45 : 0.45,
      duration: 3.2 + index * 0.28,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.45 + index * 0.14,
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });
  });

  if (scan) {
    gsap.to(scan, {
      xPercent: 850,
      duration: 5.4,
      repeat: -1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });
  }
}

function initSkills() {
  const section = document.querySelector('[data-skills-section]');
  if (!section) return;

  const titleLines = gsap.utils.toArray<HTMLElement>('[data-skills-title-line]');
  const copy = section.querySelector<HTMLElement>('[data-skills-copy]');
  const categories = gsap.utils.toArray<HTMLElement>('[data-skill-category]');
  const cards = gsap.utils.toArray<HTMLElement>('[data-skill-card]');
  const logos = gsap.utils.toArray<HTMLElement>('[data-skill-logo]');
  const scan = section.querySelector<HTMLElement>('[data-skills-scan]');
  const paths = gsap.utils.toArray<SVGGeometryElement>('[data-skill-path]');
  const nodes = gsap.utils.toArray<SVGCircleElement>('[data-skill-node]');

  if (!copy || cards.length === 0) return;

  gsap.set(titleLines, { opacity: 0, yPercent: 88, rotateX: -14, transformOrigin: 'left bottom' });
  gsap.set(copy, { opacity: 0, y: 24 });
  gsap.set(categories, { opacity: 0, y: 18, scale: 0.96 });
  gsap.set(cards, (index: number) => ({
    opacity: 0,
    y: 40,
    rotateX: -18,
    rotateZ: index % 2 === 0 ? -1.2 : 1.2,
    scale: 0.94,
    clipPath: 'inset(0% 0% 100% 0%)',
    transformPerspective: 900,
    transformOrigin: 'center bottom',
  }));
  gsap.set(logos, { rotate: -10, scale: 0.86 });
  gsap.set(nodes, { opacity: 0, scale: 0, transformOrigin: 'center' });

  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });

  const timeline = gsap.timeline({
    defaults: { ease: 'power4.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 72%',
      once: true,
    },
  });

  timeline
    .to(titleLines, { opacity: 1, yPercent: 0, rotateX: 0, duration: 0.72, stagger: 0.08 })
    .to(copy, { opacity: 1, y: 0, duration: 0.54 }, '-=0.34')
    .to(categories, { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.055 }, '-=0.24')
    .to(paths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.08, ease: 'power2.inOut' }, '-=0.45')
    .to(nodes, { opacity: 1, scale: 1, duration: 0.36, stagger: 0.035, ease: 'back.out(1.8)' }, '-=0.66')
    .to(cards, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.62,
      stagger: { amount: 0.58, from: 'center' },
      ease: 'back.out(1.16)',
    }, '-=0.34')
    .to(logos, { rotate: 0, scale: 1, duration: 0.42, stagger: { amount: 0.36, from: 'center' } }, '-=0.58');

  cards.forEach((card, index) => {
    gsap.to(card, {
      y: index % 2 === 0 ? -7 : 7,
      rotate: index % 3 === 0 ? 0.35 : -0.35,
      duration: 3.4 + index * 0.08,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.4 + index * 0.05,
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });
  });

  nodes.forEach((node, index) => {
    gsap.to(node, {
      scale: 1.75,
      opacity: 0.2,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.16,
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });
  });

  if (scan) {
    gsap.to(scan, {
      xPercent: 900,
      duration: 5.1,
      repeat: -1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
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
  initStats();
  initAbout();
  initSkills();

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
