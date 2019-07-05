// on order submit pushing cart items, name and phone # to /checkout post req
$(document).ready(function(){

  $('.twilio-frm').on('submit', event => {
    event.preventDefault();
    let data = $('.twilio-frm').serializeArray();
    data.push({name: 'cartItems', value: localStorage.getItem('foodCart')});
    $.ajax({
      data: $.param(data),// add items in cart, name, and phonenumber
      url: "/checkout",
      type: "post",
    })
    .done(function (){
    })
  });

  //after checking out, closing Modal will redirect
  $('.close-btn').on('click', event => {
    localStorage.removeItem('foodCart');
    window.location.href = "/order";
  })

  if (!localStorage.getItem('foodCart')) {
    localStorage.setItem('foodCart', JSON.stringify([]))
  }

  $('.counter').text(JSON.parse(localStorage.getItem('foodCart')).length)

  function cartItemElements(items) {
    return ` <div class='row'>
              <div class='item-content'>
                <p class='item-name'>${items.name}</p>
                <p class='item-price'>$${(items.price/100).toFixed(2)}</p>
              </div>
              <div>
                <i id="${items.id}" class="fas fa-times"></i>
              </div>
            </div>`
  }

  //to render only item price and name
  const cartItems = () => {
    let fullCart = localStorage.getItem('foodCart');
    // console.log("the id", id)
    let parsedItems = JSON.parse(fullCart);

   for(items of parsedItems) {
      let $cartItem = cartItemElements(items);
        $('.checkout-row').append($cartItem);
      }
    let sum = 0;
    for (items in parsedItems) {
        sum += parsedItems[items].price/100;
    } 
    $('.total').text(`YOUR TOTAL: $${sum}`);
  }
  cartItems();

  //to delete item from cart
  $('.fa-times').on('click', function (e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('foodCart'));
    const itemId = e.target.id
    console.log(cart.length)
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == itemId) {
        cart.splice(i, 1);
      }
    }
    localStorage.removeItem('foodCart');
    localStorage.setItem('foodCart', JSON.stringify(cart));
    $('.counter').text(cart.length);
    $('.checkout-row').empty();
    cartItems();  
    window.location.reload();
  });
});

