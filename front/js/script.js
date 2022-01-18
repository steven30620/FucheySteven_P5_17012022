
let meublesData = [];  //tableau vide qui dois récupéré data des meubles

const fetchMeuble = async() => {  //fonction qui vas récupéré les data et les mettre dans le tableau
        await fetch("http://localhost:3000/api/products") //appel de l'url pour récupéré les produits, tant que les data pas récupéré, ne passe pas dans le then
        .then((result) => result.json())  //res correspond au resultat de l'appel de l'url. (les data meuble en json, donc converti en js)
        .then((parsedResult) => {  // promise vas prendre le resultat de res.json 
            meublesData = parsedResult //parsedResult contiens mes objets js et sont rentré dans le array 
            console.log(meublesData);
        })
}

fetchMeuble()
.then(()=> {
    let htmlCard = '';

    let cards = document.getElementById("items")
    for(meuble of meublesData){
        htmlCard += '<a href="./product.html?id='+meuble._id+'"><article><img src="'+meuble.imageUrl+'" alt="'+meuble.altTxt+'"><h3 class="productName">'+meuble.name+'</h3><p class="productDescription">'+meuble.description+'</p></article></a>'
    }
    
    cards.innerHTML = htmlCard;
})


