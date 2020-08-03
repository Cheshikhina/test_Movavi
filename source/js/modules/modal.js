import overlay from './overlay';
import totalPrice from './totalPrice';
import cart from './cart';


const modal = (selectorTrigger, idTemplate = false, elCart = false) => {
  const header = document.querySelector('.header'),
    headerBtn = document.querySelector('.header__cart');
  let modalWrap, modalInner, modalBtnClose;
  const KeyCode = {
      ESC: 27,
    },
    Timeout = {
      now: 1,
      quickly: 300,
      long: 600,
    },
    body = document.querySelector('body');
  let buttons = [];

  const debounce = (cb, interval) => {
    let lastTimeout = null;

    return function () {
      let parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, interval);
    };
  };

  function addProduct(el, parentModal, isUpdateCart = false) {
    const box = parentModal.querySelector('.modal__list'),
      item = {};
    if (el != 53) {
      if (isUpdateCart) {
        let prototypeEl = document.querySelector(`[data-id ='${el}']`);
        item.title = prototypeEl.querySelector('.product__title');
        item.img = prototypeEl.dataset.img;
        item.price = prototypeEl.querySelector('.product__price_sale span');
        item.id = prototypeEl.getAttribute('data-id');
      } else {
        item.title = el.querySelector('.product__title');
        item.img = el.dataset.img;
        item.price = el.querySelector('.product__price_sale span');
        item.id = el.getAttribute('data-id');
      }
    }
    let similarProduct = document.querySelector('#modal_card_template')
      .content
      .querySelector('.modal__item');
    let product = similarProduct.cloneNode(true);

    if (el != 53) {
      product.querySelector('.modal_card__title').textContent = item.title.textContent;
      product.querySelector('.modal_card__price').textContent = item.price.textContent + '.0 руб.';
      product.setAttribute('data-id', item.id);

      Object.entries(JSON.parse(item.img)).map(([key, value]) => {

        product.querySelector('.modal_card_img img').setAttribute(key, value);
      });
    }

    box.appendChild(product);
    totalPrice();
    if (!isUpdateCart) {
      cart();
    }
    product.addEventListener('click', removeProduct);
  }

  function removeProduct(evt) {
    const currentTarget = evt.currentTarget;
    if (evt.target.classList.contains('modal_card__delete')) {
      currentTarget.remove();
    } else {
      let products = currentTarget.parentNode.querySelectorAll('.modal_card');
      products.forEach(product => {
        product.remove();
      });
    }
    cart();
    totalPrice();
  }

  function removeAllProducts() {
    const products = document.querySelectorAll('.modal__list  .modal_card');
    if (products[0]) {
      products.forEach(product => {
        product.remove();
      });
    }
  }

  function closeModalEsc(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closeModal();
    }
  }

  function closeModalHandler(evt) {
    if (evt.target.classList.contains('modal')) {
      closeModal();

    }
  }

  function checkElForCloseModal(evt) {
    if (evt.target.tagName === 'A') {
      closeModal();
    }
  }

  const openModal = debounce(function (evt, currentTarget = false) {
    if (document.querySelector('.modal--open.modal--cart')) {
      closeModal(true);
    }
    if (evt) {
      evt.preventDefault();
    }
    overlay.mainFunction('add');

    if (idTemplate) {
      let similarPopup = document.querySelector(idTemplate)
        .content
        .querySelector('.modal');
      let popup = similarPopup.cloneNode(true);
      body.appendChild(popup);
      modalWrap = popup;
      modalInner = modalWrap.querySelector('.modal__content');
      modalBtnClose = modalWrap.querySelector('.modal__close');
    } else {
      const cards = document.querySelectorAll('.modal_card'),
        btnDeleteAll = document.querySelector('.modal__reset');

      modalWrap = document.querySelector('.modal');
      modalInner = document.querySelector('.modal__content');
      modalWrap.classList.remove('modal--open');
      modalInner.classList.remove('modal__content--open');
      modalBtnClose = document.querySelector('.modal__close');

      if (currentTarget && currentTarget.classList.contains('product')) {
        addProduct(currentTarget, modalWrap);
      }
      if (cards[0]) {
        cards.forEach(card => {
          card.addEventListener('click', removeProduct);
        });
      }
      btnDeleteAll.addEventListener('click', removeProduct);
    }

    setTimeout(function () {
      modalWrap.classList.add('modal--open');
      modalInner.classList.add('modal__content--open');
    }, Timeout.now);

    totalPrice();

    if (modalWrap.classList.contains('modal--open') && modalWrap.classList.contains('modal--cart') && !headerBtn.classList.contains('header__cart--no_event')) {
      headerBtn.classList.add('header__cart--no_event');
    }

    if (localStorage.getItem('cart') == 0) {
      removeAllProducts();
      const totalPriceModal = document.querySelector('.modal__total_price'),
        totalPriceHeader = document.querySelector('.header__cart_price');
      totalPriceModal.textContent = '0.0 руб.';
      totalPriceHeader.textContent = '0.0 руб.';
    }

    modalBtnClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', closeModalEsc);
    document.addEventListener('click', closeModalHandler);
    header.addEventListener('click', checkElForCloseModal);
  }, Timeout.long);

  function closeModal(isCloseCart = false) {
    if (idTemplate) {
      if (isCloseCart) {
        modalWrap = document.querySelector('.modal');
        modalInner = document.querySelector('.modal__content');
        modalWrap.classList.remove('modal--open');
        modalInner.classList.remove('modal__content--open');
      } else {
        modalWrap = document.querySelector('.modal--' + idTemplate.slice(1));
        modalInner = modalWrap.querySelector('.modal__content');
        modalWrap.classList.remove('modal--open');
        modalInner.classList.remove('modal__content--open');

        overlay.mainFunction('remove');
      }
    } else {
      modalWrap = document.querySelector('.modal');
      modalInner = document.querySelector('.modal__content');
      modalWrap.classList.remove('modal--open');
      modalInner.classList.remove('modal__content--open');
    }

    const cards = document.querySelectorAll('.modal_card'),
      btnDeleteAll = document.querySelector('.modal__reset');

    document.removeEventListener('keydown', closeModalEsc);
    header.removeEventListener('click', checkElForCloseModal);

    if (cards[0]) {
      cards.forEach(card => {
        card.removeEventListener('click', removeProduct);
      });
    }
    if (btnDeleteAll) {
      btnDeleteAll.removeEventListener('click', removeProduct);
    }
    if (headerBtn.classList.contains('header__cart--no_event')) {
      headerBtn.classList.remove('header__cart--no_event');
    }

    if (document.querySelector('.modal--sale')) {
      overlay.mainFunction('add');
      document.querySelector('.modal--sale .modal__close').addEventListener('click', function () {
        document.querySelector('.modal--sale').classList.remove('modal--open');
        document.querySelector('.modal--sale .modal__content').classList.remove('modal__content--open');
      });
    }


    setTimeout(function () {
      if (idTemplate && isCloseCart === false) {
        body.removeChild(modalWrap);
      }
      overlay.mainFunction('remove');

      if (document.querySelector('.modal--sale')) {
        overlay.mainFunction('remove');
        body.removeChild(document.querySelector('.modal--sale'));
      }
    }, Timeout.long);

    if (isCloseCart) {
      document.addEventListener('keydown', closeModalEsc);
      header.addEventListener('click', checkElForCloseModal);
    }
  }

  if (selectorTrigger === 'timer') {
    openModal(false);
  } else {
    buttons = document.querySelectorAll(selectorTrigger);
  }

  if (buttons.length > 0) {
    buttons.forEach(button => {
      if (button.classList.contains('product')) {
        button.addEventListener('click', (evt) => {
          if (evt.target.classList.contains('product__btn')) {
            openModal(evt, evt.currentTarget);
          }
        });
      } else {
        button.addEventListener('click', openModal);
      }
    });
  }

  if (elCart) {
    const body = document.querySelector('body');
    let arElCart = elCart.split(',');
    removeAllProducts();
    arElCart.forEach(el => {
      addProduct(el, body, body);
    });
  }
};

export default modal;
