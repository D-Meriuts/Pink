function navigation() {
  // navigation toggle-button
  const navBtn = document.querySelector('.burger-toggle');
  const nav = document.querySelector('.navigation');
  const menuIcon = document.querySelector('.burger-toggle__icon');
  const container = document.querySelector('.header__container');

  document.querySelector('header').classList.remove('header--nojs');


  navBtn.onclick = function () {
    nav.classList.toggle('navigation--open');
    menuIcon.classList.toggle('burger-toggle__icon--active');
    container.classList.toggle('header__container--open')
    // document.body.classList.toggle('no-scroll');
  };
}

export default navigation;
