let cart = localStorage.getItem("productArray")
    cart = JSON.parse(cart)

const cartHtml = document.getElementById("cart__items")

const getProductInfo = async(idProduct) =>{
    let productInfoRes =await fetch("http://localhost:3000/api/products/"+idProduct) 
    return await productInfoRes.json()

    }



async function displayProduct(){
    
    for(let product of cart){

    let dataProduct = await getProductInfo(product.id)

    cartHtml.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${dataProduct.imageUrl}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${dataProduct.name}</h2>
        <p>${product.color}</p>
        <p>${dataProduct.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
    </article>`
}
}

displayProduct()

// function removeProduct() {

//     let removeButton = document.getElementsByClassName("deletItem")

//     removeButton.addEventListener('click', function (e) {
//         cartHtml.remove()
//     }
//     )

// }

// removeProduct()
