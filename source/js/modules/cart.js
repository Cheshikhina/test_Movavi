const cart = () => {
  let itemsCart = document.querySelectorAll('.modal__list .modal__item');
  let localStorageArr = [];

  itemsCart.forEach(item => {
    localStorageArr.push(item.getAttribute('data-id'));
  });

  localStorage.setItem('cart', localStorageArr);
};

export default cart;
