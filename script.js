'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scroll

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll(X/Y',window.pageXOffset,window.pageYOffset);
  // console.log('height/width vieport',document.documentElement.clientHeight,document.documentElement.clientWidth);

  // Scrooling
  // window.scrollTo(s1coords.left+window.pageXOffset
  //   ,s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left+window.pageXOffset,
  //   top:s1coords.top + window.pageYOffset,
  //   behavior:'smooth'
  // })

  section1.scrollIntoView({ behavior: 'smooth' });
});
// ////////////////////////////////////////////////////////

// Page navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();

//     const id=this.getAttribute('href');
//     console.log(id);//ime idja pa se moze koristiti varijabla dole u query selektoru
//     document.querySelector(id).scrollIntoView({behavior:'smooth'})
//   })
// })

// 1.Add event listener to common parent element
// 2. Determine what element originated event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id); //ime idja pa se moze koristiti varijabla dole u query selektoru
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed componend

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); //biramo najblizeg parenta da ne bi kliknuli span
  console.log(clicked);
  // Guard clasuse

  if (!clicked) return;

  // Remove active clases

  tabs.forEach(tab => tab.classList.remove('operations__tab--active')); //removing active class\

  // Active tab

  clicked.classList.add('operations__tab--active');
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Manu fade animation

const nav = document.querySelector('.nav');
const handleHover = function (e) {
  console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //biramo ostale linkove
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(ell => {
      if (ell !== link) ell.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing "argument" in handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener(
  'mouseout',
  handleHover.bind(1) //moze i ovako sa bind jer dobijamo this
);

// Sticky navigation
// const initialCoords=section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll',function() {
//   console.log(window.scrollY);
//    if(this.window.scrollY > initialCoords.top) nav.classList.add('sticky')
//    else nav.classList.remove('sticky')
// })
// const obsCallback=function(entries,observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }
// const obsOptions={
//   root:null,
//   threshold:[0,0.2]
// }

// const observer= new IntersectionObserver(obsCallback,obsOptions);
// observer.observe(section1)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden')
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]'); //samo lazy images
const loadImg = function (entries, observer) {
  const [entry] = entries; //zbog 1 thresholda
  console.log(entry);
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// SLider element
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

// 0%, 100%,200$,300%,400%
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);
// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide === maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Selecting elements
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

// Creating and inserting elements

// .insertAdjacentHtml

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cookies for improved funcionality and analytics.';
message.innerHtml =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true))

// header.before(message);
header.after(message);
// Delete element
// message.remove()

// Styles

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes

const logo = document.querySelector('.nav__logo');
console.log(logo);
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
console.log(logo.getAttribute('src'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes

logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toogle('c');
logo.classList.contains('c');

// Don't use
logo.className = 'jonas';
*/

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector("#section--1");

// btnScrollTo.addEventListener('click',function(e){
//   const s1coords=section1.getBoundingClientRect();
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());
//   console.log('Current scroll(X/Y',window.pageXOffset,window.pageYOffset);
//   console.log('height/width vieport',document.documentElement.clientHeight,document.documentElement.clientWidth);

//     // Scrooling
//   // window.scrollTo(s1coords.left+window.pageXOffset
//   //   ,s1coords.top + window.pageYOffset);

//     // window.scrollTo({
//     //   left: s1coords.left+window.pageXOffset,
//     //   top:s1coords.top + window.pageYOffset,
//     //   behavior:'smooth'
//     // })

//     section1.scrollIntoView({behavior:'smooth'})
// })
// const alertH1=function(e) {
//   alert('addEventListener:Great!You are reading the heading');
//   h1.removeEventListener('mouseenter',alertH1)
// }
// const h1=document.querySelector('h1');
// h1.addEventListener('mouseenter',alertH1)

// // h1.onmouseenter = function(e) {
// //   alert('onmouseenter:Great!You are reading the heading')
// // }

// rgb(255,255,255)

/*const randomInt=(min,max) =>Math.floor(Math.random()*(max-min +1)+min);
const randomColor = () => 
  `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`

document.querySelector('.nav__link').addEventListener('click',function(e){
 this.style.backgroundColor=randomColor();
 console.log('LINK',e.target),e.currentTarget;
 console.log(e.currentTarget===this);

  //  stop propagation
  e.stopPropagation()
})
document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log('Container',e.target,e.currentTarget);
  e.stopPropagation()
})
document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log('NAV',e.target,e.currentTarget);
})
*/

// const h1=document.querySelector('h1');

// // going downward:child

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
// h1.firstElementChild.style.color='white'
// h1.lastElementChild.style.color='orangered';

// // going upwards:parents

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background="var(--gradient-secondary)";

// // Going sideways:siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(el=>{
//   if(el!==h1) el.style.background="blue"
// })
