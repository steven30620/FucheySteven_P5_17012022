//Page produits

let urlPage = new URL(document.location.href); // récuperation des info de la page web active
let idProduct = urlPage.searchParams.get("id"); // récuperation de l'ID dans l'objet

const getProductInfo = async () => {
	let productInfoRes = await fetch(
		"http://localhost:3000/api/products/" + idProduct
	); // liens menant à la page de l'article selectionné
	return await productInfoRes.json();
};

let displayProduct = async () => {
	// fonction qui vas afficher les info par rapport à l'objet séléctionné sur la page précédente
	let productInfo = await getProductInfo();
	let htmlProductCard = "";

	let cardProductImg = document.getElementsByClassName("item__img"); // récupération de la div avec la class item__img pour y ajouter le code html
	htmlProductCard =
		'<img src="' +
		productInfo.imageUrl +
		'" alt=' +
		productInfo.altTxt +
		'"/>';
	cardProductImg[0].innerHTML = htmlProductCard; // le [0] correspond au premier élément du tableau crée par l'appel de la div contenant la class "item_img", car il peut y avoir plusieur class de même nom

	let productName = document.getElementById("title"); //ajout du nom
	productName.innerHTML = productInfo.name;

	let productPrice = document.getElementById("price"); // ajout du prix
	productPrice.innerHTML = productInfo.price;

	let productDescription = document.getElementById("description"); //ajout de la description
	productDescription.innerHTML = productInfo.description;

	let colors = productInfo.colors;
	let colorsChoice = document.getElementById("colors"); // récupération de la parie contenant le menu déroulant pour les couleurs
	let htmlColor = "";

	for (color of colors) {
		//pour chaque couleur du tableau couleur une nouvelle ligne html est crée

		htmlColor += '<option value="' + color + '">' + color + "</option>";
	}
	colorsChoice.innerHTML = htmlColor; // ajout du code html dans le menu déroulant.
};

displayProduct(); //affichage des info du produit séléctionné

const sendDataToCart = () => {
	//envoie des donnée de la page dans le local storage

	let addToCart = document.getElementById("addToCart"); //récupere les donnée dans la balise avec l'id addtocart
	let quantity = document.getElementById("quantity");
	let color = document.getElementById("colors");
	let cart = []; //création du tableau qui sera la panier du client

	if (localStorage.getItem("productArray") !== null) {
		//on check si des données ne sont pas déjà stocké dans le local storage pour les récupéré si c'est le cas
		cart = JSON.parse(localStorage.getItem("productArray")); //convertion du JSON en JS pour pouvoir traiter les donnée
	}

	addToCart.addEventListener("click", function (e) {
		//détection du click du client
		let productDetail = {
			//envoie des donnée correspondant a la séléction du client dans le tableau Cart
			id: idProduct,
			color: color.value,
			quantity: quantity.value,
		};

		let productAlreadyInCart = cart.find(
			(product) =>
				product.id === idProduct && product.color === color.value
		); //vérifie dans le tableau si un Id semblable est déjà stocké

		if (productAlreadyInCart) {
			// ajout de la quantité au lieu de la création d'un nouvelle objet dans le tableau cart

			let totalQuantity =
				Number(productAlreadyInCart.quantity) + Number(quantity.value);
			productAlreadyInCart.quantity = totalQuantity;
			localStorage.setItem("productArray", JSON.stringify(cart));
		} else {
			cart.push(productDetail);
			localStorage.setItem("productArray", JSON.stringify(cart)); //convertion des donné du JS en JSON
		}
	});
};

sendDataToCart();
