const common = () => {
  const noFocus = () => {
    document.addEventListener('mouseup', function (evt) {
      if (evt.target.tagName !== 'A' && evt.target.tagName !== 'BUTTON') {
        return;
      }
      evt.target.blur();
    });
  };

  noFocus();
};

export default common;
