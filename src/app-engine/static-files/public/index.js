window.onload = function onload() {
  const url = 'https://cors-dot-shadowsocks-218808.appspot.com/images/city.jpeg';
  fetch(url)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
