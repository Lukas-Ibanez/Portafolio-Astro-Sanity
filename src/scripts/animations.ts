import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallViewport = window.matchMedia('(max-width: 767px)').matches;

function setFinalState() {
  gsap.set(
    '.reveal, .batch-reveal, [data-hero-line-text], [data-hero-kicker], [data-hero-copy], [data-hero-cta], [data-hero-signal], [data-hero-core], [data-hero-chip], [data-hero-capability], [data-stats-intro], [data-stat-card], [data-workflow-step], [data-about-title-line], [data-about-copy], [data-about-layer], [data-skills-title-line], [data-skills-copy], [data-skill-category], [data-skill-card], [data-skill-logo], [data-skill-node], [data-projects-title-line], [data-projects-copy], [data-projects-action], [data-projects-frame], [data-project-slide], [data-blog-title-line], [data-blog-copy], [data-blog-action], [data-blog-card], [data-blog-tag], [data-blog-node], [data-blog-rule], [data-contact-title-line], [data-contact-copy], [data-contact-action], [data-contact-core], [data-contact-badge], [data-contact-node]',
    { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'transform' },
  );
  gsap.set('[data-hero-path], [data-hero-ring], [data-stats-path], [data-stats-ring], [data-about-step-path], [data-skill-path], [data-blog-path], [data-contact-path]', { strokeDashoffset: 0 });
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

function initProjects() {
  const sections = gsap.utils.toArray<HTMLElement>('[data-projects-section]');
  if (sections.length === 0) return;

  sections.forEach((section) => {
    const titleLines = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-projects-title-line]'));
    const copy = section.querySelector<HTMLElement>('[data-projects-copy]');
    const actions = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-projects-action]'));
    const frame = section.querySelector<HTMLElement>('[data-projects-frame]');
    const slides = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-project-slide]'));
    const dots = gsap.utils.toArray<HTMLButtonElement>(section.querySelectorAll('[data-project-dot]'));
    const dotBars = dots.map((dot) => dot.querySelector<HTMLElement>('span')).filter(Boolean);

    if (!copy || !frame || slides.length === 0) return;

    gsap.set(titleLines, { opacity: 0, yPercent: 88, rotateX: -14, transformOrigin: 'left bottom' });
    gsap.set(copy, { opacity: 0, y: 24 });
    gsap.set(actions, { opacity: 0, y: 18 });
    gsap.set(frame, { opacity: 0, x: -56, rotateY: -8, scale: 0.96, transformPerspective: 1000 });
    gsap.set(slides, { opacity: 0, xPercent: 10, scale: 1.04, clipPath: 'inset(0% 0% 0% 100%)' });
    gsap.set(slides[0], { opacity: 1, xPercent: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.set(dotBars, { scaleX: 0 });

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
      .to(actions, { opacity: 1, y: 0, duration: 0.42, stagger: 0.06 }, '-=0.24')
      .to(frame, { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.82, ease: 'power3.out' }, '-=0.7')
      .fromTo(slides[0], { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.08 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.82, ease: 'power3.out' }, '-=0.46');

    let activeIndex = 0;
    const duration = 4.8;
    let progressTween: gsap.core.Tween | undefined;

    const setActiveDot = (index: number) => {
      dots.forEach((dot, dotIndex) => {
        dot.setAttribute('aria-pressed', dotIndex === index ? 'true' : 'false');
      });
      gsap.set(dotBars, { scaleX: 0 });
      if (dotBars[index]) {
        progressTween = gsap.to(dotBars[index], { scaleX: 1, duration, ease: 'none' });
      }
    };

    const showSlide = (nextIndex: number) => {
      if (nextIndex === activeIndex || slides.length <= 1) return;

      const current = slides[activeIndex];
      const next = slides[nextIndex];
      const direction = nextIndex > activeIndex ? 1 : -1;

      progressTween?.kill();
      slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index === nextIndex ? 'false' : 'true');
      });

      gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .set(next, {
          opacity: 1,
          xPercent: direction * 16,
          scale: 1.04,
          clipPath: direction === 1 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
        })
        .to(current, {
          opacity: 0,
          xPercent: -direction * 12,
          scale: 0.98,
          clipPath: direction === 1 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
          duration: 0.72,
        })
        .to(next, {
          xPercent: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.78,
        }, '-=0.68');

      activeIndex = nextIndex;
      setActiveDot(activeIndex);
    };

    const autoTimeline = gsap.timeline({
      repeat: -1,
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });

    if (slides.length > 1) {
      setActiveDot(0);
      autoTimeline.to({}, {
        duration,
        repeat: -1,
        onRepeat: () => {
          showSlide((activeIndex + 1) % slides.length);
        },
      });

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          autoTimeline.restart();
          showSlide(index);
        });
      });
    }
  });
}

function initBlogTeaser() {
  const section = document.querySelector('[data-blog-section]');
  if (!section) return;

  const titleLines = gsap.utils.toArray<HTMLElement>('[data-blog-title-line]');
  const copy = section.querySelector<HTMLElement>('[data-blog-copy]');
  const action = section.querySelector<HTMLElement>('[data-blog-action]');
  const card = section.querySelector<HTMLElement>('[data-blog-card]');
  const rule = section.querySelector<HTMLElement>('[data-blog-rule]');
  const tags = gsap.utils.toArray<HTMLElement>('[data-blog-tag]');
  const paths = gsap.utils.toArray<SVGGeometryElement>('[data-blog-path]');
  const nodes = gsap.utils.toArray<SVGCircleElement>('[data-blog-node]');
  const scan = section.querySelector<HTMLElement>('[data-blog-scan]');

  if (!copy || !card) return;

  gsap.set(titleLines, { opacity: 0, yPercent: 88, rotateX: -14, transformOrigin: 'left bottom' });
  gsap.set(copy, { opacity: 0, y: 24 });
  gsap.set(action, { opacity: 0, y: 18 });
  gsap.set(card, {
    opacity: 0,
    y: 18,
    clipPath: 'inset(0% 0% 100% 0%)',
  });
  gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(tags, { opacity: 0, y: 12, scale: 0.92 });
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
    .to(action, { opacity: 1, y: 0, duration: 0.42 }, '-=0.24')
    .to(paths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.08, ease: 'power2.inOut' }, '-=0.42')
    .to(nodes, { opacity: 1, scale: 1, duration: 0.34, stagger: 0.04, ease: 'back.out(1.8)' }, '-=0.68')
    .to(card, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.72,
      ease: 'power3.out',
    }, '-=0.38')
    .to(rule, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, '-=0.5')
    .to(tags, { opacity: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.05 }, '-=0.34');

  if (rule) {
    gsap.to(rule, {
      scaleX: 0.18,
      xPercent: 455,
      duration: 2.4,
      repeat: -1,
      repeatDelay: 0.4,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    });
  }

  tags.forEach((tag, index) => {
    gsap.to(tag, {
      borderColor: 'rgba(204, 120, 92, 0.55)',
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.22,
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
      scale: 1.65,
      opacity: 0.2,
      duration: 1.45,
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
      duration: 5.2,
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

function initContact() {
  const section = document.querySelector('[data-contact-section]');
  if (!section) return;

  const titleLines = gsap.utils.toArray<HTMLElement>('[data-contact-title-line]');
  const copy = section.querySelector<HTMLElement>('[data-contact-copy]');
  const actions = gsap.utils.toArray<HTMLElement>('[data-contact-action]');
  const core = section.querySelector<HTMLElement>('[data-contact-core]');
  const badges = gsap.utils.toArray<HTMLElement>('[data-contact-badge]');
  const paths = gsap.utils.toArray<SVGGeometryElement>('[data-contact-path]');
  const nodes = gsap.utils.toArray<SVGCircleElement>('[data-contact-node]');
  const scan = section.querySelector<HTMLElement>('[data-contact-scan]');

  if (!copy || !core || actions.length === 0) return;

  gsap.set(titleLines, { opacity: 0, yPercent: 88, rotateX: -14, transformOrigin: 'left bottom' });
  gsap.set(copy, { opacity: 0, y: 24 });
  gsap.set(actions, { opacity: 0, y: 24, scale: 0.97 });
  gsap.set(core, { opacity: 0, scale: 0.82, rotate: -1.5 });
  gsap.set(badges, { opacity: 0, scale: 0.84, y: 18 });
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
    .to(actions, { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.08 }, '-=0.24')
    .to(paths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.08, ease: 'power2.inOut' }, '-=0.56')
    .to(nodes, { opacity: 1, scale: 1, duration: 0.34, stagger: 0.035, ease: 'back.out(1.8)' }, '-=0.66')
    .to(core, { opacity: 1, scale: 1, rotate: 0, duration: 0.62, ease: 'back.out(1.25)' }, '-=0.44')
    .to(badges, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(1.65)' }, '-=0.34');

  badges.forEach((badge, index) => {
    gsap.to(badge, {
      y: index % 2 === 0 ? -7 : 7,
      rotate: index % 2 === 0 ? -0.4 : 0.4,
      duration: 3.1 + index * 0.32,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.1 + index * 0.14,
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
      scale: 1.8,
      opacity: 0.18,
      duration: 1.35,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.13,
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
      duration: 5.2,
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

// ── Intro: light beam sweeps the hero into view on load ─────────────────────
function initIntro() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const beam = document.getElementById('intro-beam');

  // Reveal the whole hero with a left→right wipe (negative top/bottom so
  // overflowing chips/shadows are not clipped).
  gsap.set(hero, { clipPath: 'inset(-25% 100% -25% 0%)' });
  gsap.timeline()
    .to(hero, { clipPath: 'inset(-25% 0% -25% 0%)', duration: 1.05, ease: 'power3.inOut' }, 0.05)
    .set(hero, { clipPath: 'none' });

  if (beam) {
    gsap.set(beam, { xPercent: -135, opacity: 0 });
    gsap.timeline()
      .to(beam, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0)
      .to(beam, { xPercent: 245, duration: 1.05, ease: 'power2.inOut' }, 0)
      .to(beam, { opacity: 0, duration: 0.34, ease: 'power1.in' }, 0.8);
  }
}

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) {
    setFinalState();
    return;
  }

  document.documentElement.classList.add('motion-ready');

  initIntro();
  initHero();
  initStats();
  initAbout();
  initSkills();
  initProjects();
  initBlogTeaser();
  initContact();

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
