'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const sections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnSliderRight = document.querySelector('.slider__btn--right');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Scrolling

btnScrollTo.addEventListener('click', e => {
  // const s1coords = section1.getBoundingClientRect();
  // console.log('s1coords', s1coords);

  // console.log('btncoords', e.target.getBoundingClientRect());

  // console.log('Current scroll (x/y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //scrolling
  // just setting x,y
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // setting up x,y along with scroll effect
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New method, works only in modern browser
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

// Below approach will be useful for two or three components, when we have more
// no of components, we cant add events like this.. it is better to use parent
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const pageContainer = e.target.getAttribute('href');
    document
      .querySelector(pageContainer)
      .scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbing

// This is bad practise, use event deligation
// tabs.forEach(t =>
//   t.addEventListener('click', () => {
//     console.log('TAB');
//   })
// );

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Switching content
  tabContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade Animations
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.4));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
/* 
  The below code is very bad code since it will impact more on performance
  using window.scroll event will be bad for mobile view and it triggers even for 
  small change in scroll

const initCoord = section1.getBoundingClientRect();
console.log(initCoord);

window.addEventListener('scroll', function () {
  console.log(window.scrollY);

  if (window.scrollY > initCoord.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/
// Sticky navigation using Intersection Observer API
const stickyNav = function (events) {
  const [event] = events;
  if (!event.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Revealing sections slowly
const secSlowReveal = function (events) {
  const [event] = events;

  if (!event.isIntersecting) return;

  event.target.classList.remove('section--hidden');
};

const revealSection = new IntersectionObserver(secSlowReveal, {
  root: null,
  threshold: 0.15,
});

sections.forEach(sec => {
  revealSection.observe(sec);
  sec.classList.add('section--hidden');
});

// Lazy image loading
const lazyLoadImg = function (events) {
  const [event] = events;

  if (!event.isIntersecting) return;
  event.target.src = event.target.dataset.src;

  // event.target.classList.remove('lazy-img');
  event.target.addEventListener('load', function (e) {
    event.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(lazyLoadImg, {
  root: null,
  threshold: 0,
  rootMargin: '50px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Slide Images/Comments

// Creating Dots
const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

let slidepos = 0;
const maxSlide = slides.length;
// Activating dot
const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
  activeDot(slide);
};

const init = function inti() {
  createDots();
  goToSlide(0);
};
init();

const nextSlide = function () {
  if (slidepos === maxSlide - 1) {
    slidepos = 0;
  } else {
    slidepos++;
  }
  goToSlide(slidepos);
};

const prevSlide = function () {
  if (slidepos === 0) {
    slidepos = maxSlide - 1;
  } else {
    slidepos--;
  }
  goToSlide(slidepos);
};

btnSliderRight.addEventListener('click', function () {
  nextSlide();
});

btnSliderLeft.addEventListener('click', function () {
  prevSlide();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

//
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
  }
});
