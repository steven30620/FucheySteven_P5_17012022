let cart = localStorage.getItem("productArray")
    cart = JSON.parse(cart)
    productsInCart = []


const cartHtml = document.getElementById("cart__items")

const getProductInfo = async() =>
{
    for(product of cart){      
        let productInfoRes = await fetch("http://localhost:3000/api/products/"+product.id)
        let jsonProduct = await productInfoRes.json() 

        productsInCart.push(jsonProduct) 
    }    
}

let firstTotalPrice = 0
let totalQuantity = 0
let firstSumQuantity = 0
let sumPrice = 0
let quantityProductChanged = 0

async function displayProduct(){  
    await getProductInfo()
    for(product of cart){   
        let infoProduct = await productsInCart.find((productInCart) => productInCart._id == product.id )
        
        cartHtml.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
        <div class="cart__item__img">
        <img src="${infoProduct.imageUrl}">
        </div>
        <div class="cart__item__content">   
        <div class="cart__item__content__description">
            <h2>${infoProduct.name}</h2>
            <p>${product.color}</p>
            <p>${infoProduct.price}€</p>
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


        firstTotalPrice += infoProduct.price * product.quantity  
        firstSumQuantity += Number(product.quantity)
        console.log(product.quantity);
    }

    calculPrice()
    displayTotal()   
    detectChange()
    removeSelectedProduct()
    
}

displayProduct() 



function displayTotal (){    

    let displayTotalQuantity = document.getElementById('totalQuantity')
    displayTotalQuantity.innerHTML = parseInt(totalQuantity)// affiche le nombre total d'article et enlève le 0devant le nombre

    let displayPrice = document.getElementById('totalPrice')
        displayPrice.innerHTML = totalPrice
    }


let calculPrice = async()=>{

    let sumQuantity = 0
    let newTotal = 0 
    for(product of cart){
        
        let infoProduct = await productsInCart.find((productInCart) => productInCart._id == product.id )

        newTotal += infoProduct.price * product.quantity

        sumQuantity += Number(product.quantity)


    }

        totalQuantity = Number(sumQuantity)
        totalPrice = Number(newTotal)

        displayTotal()
}  

function detectChange() {
    let detectChange = document.querySelectorAll('.itemQuantity') 
    
    detectChange.forEach(function(selector){
        selector.addEventListener('change', function(e){

            let id = selector.closest('article').dataset.id
            let color = selector.closest('article').dataset.color
            let productAlreadyInCart = cart.find((product) =>product.id == id && product.color ==  color )
    
            
            productAlreadyInCart.quantity = Number(e.target.value) 


            localStorage.setItem("productArray", JSON.stringify(cart)) 
            calculPrice()
        
        }
        ) 
    })
    
}

function removeSelectedProduct() {
    let detectChange = document.querySelectorAll('.deleteItem') 
    
    detectChange.forEach(function(selector){
        selector.addEventListener('click', function(e){

            let id = selector.closest('article').dataset.id
            let color = selector.closest('article').dataset.color
            let cartLine = selector.closest('article')
            let indexProductToRemove = cart.findIndex((product) =>product.id == id && product.color ==  color )
            
            if (indexProductToRemove != -1){
                cartLine.remove()
                cart.splice(indexProductToRemove, 1 )
                localStorage.setItem("productArray", JSON.stringify(cart)) 
            }
            calculPrice()
        })
    })
    
}

function verifForm() {
    let onlyLetter = /^[a-zA-Z'' ']{1,25}$/
    let numberAndLetter = /\w/
    let minimumForEmail = /[@]{1}'.'{1}/

    let detectChangeFirstName = document.getElementById('firstName') 
    let detectChangeLastName  = document.getElementById('lastName') 
    let detectChangeAddress = document.getElementById('address')
    let detectChangeCity  = document.getElementById('city')
    let detectChangeEmail = document.getElementById('email')


        detectChangeFirstName.addEventListener('input', function(e){
            
           if(detectChangeFirstName.value.match(onlyLetter)){
               
            return  }

            else(detectChangeFirstName.value.match(numberAndLetter))
                let err = document.getElementById('firstNameErrorMsg')
                err.innerHTML=("Seulement les lettres sont autorisés")
            })

        detectChangeLastName.addEventListener('input', function(e){
            
            if(detectChangeLastName.value.match(onlyLetter)){
                    
                return  }
    
                else(detectChangeLastName.value.match(numberAndLetter))
                    let err = document.getElementById('lastNameErrorMsg')
                    err.innerHTML=("Seulement les lettres sont autorisés")
                })

        detectChangeAddress.addEventListener('input', function(e){
            
                if(detectChangeAddress.value.match(numberAndLetter)){
                            
                return  }
            
                else(detectChangeAddress.value.match(numberAndLetter))
                    let err = document.getElementById('addressErrorMsg')
                    err.innerHTML=("Seulement les lettres sont autorisés")
                })

                detectChangeCity.addEventListener('input', function(e){
            
                    if(detectChangeCity.value.match(onlyLetter)){
                                
                    return  }
                
                    else(detectChangecity.value.match(numberAndLetter))
                        let err = document.getElementById('cityErrorMsg')
                        err.innerHTML=("Seulement les lettres sont autorisés")
                    })    
                    
                    detectChangeEmail.addEventListener('change', function(e){
            
                        if(detectChangeEmail.value.match(minimumForEmail)){
                                    
                        return  }
                    
                        else(detectChangeEmail.value.match(numberAndLetter))
                            let err = document.getElementById('emailErrorMsg')
                            err.innerHTML=("Email incorrect")
                        }) 

}
verifForm()



