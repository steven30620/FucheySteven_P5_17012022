//Page produits

let urlPage = new URL(document.location.href) // récuperation des info de la page web active
let idProduct = urlPage.searchParams.get('id') // récuperation de l'ID dans l'objet 


const getProductInfo = async() =>{
    let productInfoRes =await fetch("http://localhost:3000/api/products/"+idProduct) // liens menant à la page de l'article selectionné
    return await productInfoRes.json()

    }


let displayProduct = async() =>{    // fonction qui vas afficher les info par rapport à l'objet séléctionné sur la page précédente
    let productInfo = await getProductInfo()
    let htmlProductCard =  ''
    
    let cardProductImg = document.getElementsByClassName("item__img")  // récupération de la div avec la class item__img pour y ajouter le code html
    htmlProductCard ='<img src="'+productInfo.imageUrl+'" alt='+productInfo.altTxt+'"/>'
    cardProductImg[0].innerHTML = htmlProductCard    // le [0] correspond au premier élément du tableau crée par l'appel de la div contenant la class "item_img", car il peut y avoir plusieur class de même nom
    
    let productName = document.getElementById('title') //ajout du nom 
    productName.innerHTML = productInfo.name
    
    let productPrice = document.getElementById('price')     // ajout du prix
    productPrice.innerHTML = productInfo.price

    let productDescription = document.getElementById('description') //ajout de la description 
    productDescription.innerHTML = productInfo.description 

    let colors = productInfo.colors
    let colorsChoice = document.getElementById("colors")  // récupération de la parie contenant le menu déroulant pour les couleurs
    let htmlColor = ''

    for(color of colors){  //pour chaque couleur du tableau couleur une nouvelle ligne html est crée
        
        htmlColor += '<option value="'+color+'">'+color+'</option>'
    }
    colorsChoice.innerHTML = htmlColor // ajout du code html dans le menu déroulant


}  

displayProduct() //affichage des info du produit séléctionné 

const sendDataToCart =() =>{     //envoie des donnée de la page dans le local storage

    let addToCart = document.getElementById('addToCart')  
    let cart = []   
    let quantity = document.getElementById("quantity")
    let color = document.getElementById("colors")

    addToCart.addEventListener('click',function(e){
        let productDetail = {
            id: idProduct,
            color: color.value,
            quantity: quantity.value
        }
        cart.push(productDetail) 
        localStorage.setItem("productArray", JSON.stringify(cart))
}
)

}

sendDataToCart()



