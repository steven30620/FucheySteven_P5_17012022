const getProducts = async() => {   //fonction qui vas récupéré les info à partir de l'api 
    let dataProducts = await fetch("http://localhost:3000/api/products") 
       return await dataProducts.json()   // réponse des donné seulement après les avoir récupéré
}


let displayProducts  = async ()=> {    // fonction qui vas afficher les produits 
    let dataProducts = await getProducts()    // on donnes les info à la variable dataProducts
    let htmlCard = '';  
    let cards = document.getElementById("items")   //récupération de la div avec l'id items en vue d'y ajouter le html pour chaque produits
    
    for(product of dataProducts){ 
        htmlCard += '<a href="./product.html?id='+product._id+'"><article><img src="'+product.imageUrl+'" alt="'+product.altTxt+'"><h3 class="productName">'+product.name+'</h3><p class="productDescription">'+product.description+'</p></article></a>'
    }
    
    cards.innerHTML = htmlCard;  //ajout du html correspondant au cartes, pour chaque élément du tableau dataProducts 
}

displayProducts()  //affichage des produits