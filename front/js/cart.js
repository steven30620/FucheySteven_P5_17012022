let urlPage = new URL(document.location.href);

if (urlPage.pathname == "/front/html/cart.html") {
	let cart = localStorage.getItem("productArray"); // récupération des info du local storage
	cart = JSON.parse(cart); //converstion en objet javascript
	productsInCart = []; //declation d'un tableau en vue d'y ajouter les information de mes produits

	const cartHtml = document.getElementById("cart__items"); //récupération du html en vue d'y ajouter les produits

	const getProductInfo = async () =>
		// fonction qui vas récupéré les info dans l'api pour chaque produit dans le panier
		{
			for (product of cart) {
				let productInfoRes = await fetch(
					"http://localhost:3000/api/products/" + product.id
				);
				let jsonProduct = await productInfoRes.json();

				productsInCart.push(jsonProduct); //ajout de l'objet js dans le tableau contenant toute les information de mes produits dans le localstorage
			}
		};

	let firstTotalPrice = 0; //déclaration de variable en vue du calcul des prix et quantité
	let totalQuantity = 0;
	let firstSumQuantity = 0;
	let sumPrice = 0;
	let quantityProductChanged = 0;

	async function displayProduct() {
		//fonction qui vas crée pour chaque produit une ligne dans le panier
		await getProductInfo(); //attente de la réponse de L'api
		for (product of cart) {
			let infoProduct = await productsInCart.find(
				(productInCart) => productInCart._id == product.id
			); // on prend les information correspondante pour chaque produit du panier en fonction de leur Id
			//création du html pour les produits du panier en changeant les variables pour integrer les infos
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
        </article>`;

			firstTotalPrice += infoProduct.price * product.quantity; //premier calcul des prix
			firstSumQuantity += Number(product.quantity); //premier calcul de la quantité
		}

		calculPrice(); //initialisation des fonction
		displayTotal();
		detectChange();
		removeSelectedProduct();
	}

	displayProduct();

	function displayTotal() {
		//fonction qui vas afficher le prix total et la quantité total en fonction des information reçu

		let displayTotalQuantity = document.getElementById("totalQuantity");
		displayTotalQuantity.innerHTML = parseInt(totalQuantity); // affiche le nombre total d'article et enlève le 0devant le nombre

		let displayPrice = document.getElementById("totalPrice");
		displayPrice.innerHTML = totalPrice;
	}

	let calculPrice = async () => {
		//fonction qui vas calculer le prix en cas de changement des valeur dans la page panier

		let sumQuantity = 0;
		let newTotal = 0;
		for (product of cart) {
			let infoProduct = await productsInCart.find(
				(productInCart) => productInCart._id == product.id
			); //on reprend les info des produit du panier pour recalculer le prix car il n'es pas stocké en local

			newTotal += infoProduct.price * product.quantity;

			sumQuantity += Number(product.quantity);
		}

		totalQuantity = Number(sumQuantity);
		totalPrice = Number(newTotal);

		displayTotal();
	};

	function detectChange() {
		//fonction qui vas detecté si la quantité d'un produit et changer sur la page
		let detectChange = document.querySelectorAll(".itemQuantity"); //on repère toute les div qui se nomme itemquantity

		detectChange.forEach(function (selector) {
			//on applique pour chaque div un eventListenner click
			selector.addEventListener("change", function (e) {
				let id = selector.closest("article").dataset.id; //on prend les information du parent detecté dans la balise article
				let color = selector.closest("article").dataset.color;
				let productAlreadyInCart = cart.find(
					(product) => product.id == id && product.color == color
				); //on recherche l'objet qui correspond dans le local storage

				productAlreadyInCart.quantity = Number(e.target.value); //on remplace la quantité présente dans le localstorage par la valeur selectionné

				localStorage.setItem("productArray", JSON.stringify(cart)); //ajout des information dans le panier
				calculPrice(); // relance la fonction pour calculer le nouveau prix
			});
		});
	}

	function removeSelectedProduct() {
		//permet la suppression d'un produit dans le localstorage et sur la page panier
		let detectChange = document.querySelectorAll(".deleteItem"); //on recherche toute les div deleteItem

		detectChange.forEach(function (selector) {
			// et on applique un event listenner comme précèdement
			selector.addEventListener("click", function (e) {
				let id = selector.closest("article").dataset.id;
				let color = selector.closest("article").dataset.color;
				let cartLine = selector.closest("article");
				let indexProductToRemove = cart.findIndex(
					(product) => product.id == id && product.color == color
				);

				if (indexProductToRemove != -1) {
					// si un prosuit correspond dans le local, alors on le supprime et on supprime le parent le plus proche
					cartLine.remove();
					cart.splice(indexProductToRemove, 1);
					localStorage.setItem("productArray", JSON.stringify(cart)); //ajout des nouvelles information dans le local
				}
				calculPrice(); // et relance du calcul du prix
			});
		});
	}

	function verifForm() {
		//fonction permettant de vérifier les input dans le formulaire
		let letterWithSpace = /^[a-zA-Z\s]{2,25}$/; //autorise toute les lettre et le tiret
		let LetterAndNumber = /^[\w]{1,}/;
		let minimumForEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
		let specialCharacter = /[^a-zA-Z0-9-_\s]/;

		let detectChangeFirstName = document.getElementById("firstName");
		let detectChangeLastName = document.getElementById("lastName");
		let detectChangeAddress = document.getElementById("address");
		let detectChangeCity = document.getElementById("city");
		let detectChangeEmail = document.getElementById("email");

		detectChangeFirstName.addEventListener("input", function (e) {
			if (detectChangeFirstName.value.match(letterWithSpace)) {
				let err = document.getElementById("firstNameErrorMsg");
				if (err != null) {
					err.innerHTML = " ";
					detectChangeFirstName.setCustomValidity("");
				}
				return;
			} else {
				let err = document.getElementById("firstNameErrorMsg");
				err.innerHTML = "Seulement les lettres sont autorisés";
				detectChangeFirstName.setCustomValidity(
					"Seulement les lettres sont autorisés"
				);
			}
		});

		detectChangeLastName.addEventListener("input", function (e) {
			if (detectChangeLastName.value.match(letterWithSpace)) {
				let err = document.getElementById("lastNameErrorMsg");
				if (err != null) {
					err.innerHTML = " ";
					detectChangeLastName.setCustomValidity("");
				}
				return;
			} else {
				let err = document.getElementById("lastNameErrorMsg");
				err.innerHTML = "Seulement les lettres sont autorisés";
				detectChangeLastName.setCustomValidity(
					"Seulement les lettres sont autorisés"
				);
			}
		});

		detectChangeAddress.addEventListener("input", function (e) {
			let err = document.getElementById("addressErrorMsg");
			if (detectChangeAddress.value.match(specialCharacter)) {
				err.innerHTML = "Adresse invalide";
				detectChangeAddress.setCustomValidity("Adresse invalide");
			} else {
				err.innerHTML = " ";
				detectChangeLastName.setCustomValidity("");
			}
		});

		detectChangeCity.addEventListener("input", function (e) {
			if (detectChangeCity.value.match(letterWithSpace)) {
				let err = document.getElementById("cityErrorMsg");
				if (err != null) {
					err.innerHTML = " ";
					detectChangeCity.setCustomValidity("");
				}
				return;
			} else {
				let err = document.getElementById("cityErrorMsg");
				err.innerHTML = "Seulement les lettres sont autorisés";
				detectChangeCity.setCustomValidity(
					"Seulement les lettres sont autorisés"
				);
			}
		});

		detectChangeEmail.addEventListener("input", function (e) {
			if (
				detectChangeEmail.value.match(minimumForEmail) &&
				detectChangeEmail.value.match(LetterAndNumber)
			) {
				if (detectChangeEmail.value.match(letterWithSpace)) {
					let err = document.getElementById("emailErrorMsg");
					err.innerHTML = "Email invalide";
					detectChangeEmail.setCustomValidity("Email invalide");
				} else if (detectChangeEmail.value.match(specialCharacter)) {
					let err = document.getElementById("emailErrorMsg");
					err.innerHTML = "Email invalide";
					detectChangeEmail.setCustomValidity("Email invalide");
				}
				let err = document.getElementById("emailErrorMsg");
				err.innerHTML = " ";
				detectChangeEmail.setCustomValidity("");
			} else {
				let err = document.getElementById("emailErrorMsg");
				err.innerHTML = "Adresse invalide";
				detectChangeEmail.setCustomValidity("Email invalide");
			}
		});
	}
	verifForm();

	async function getDataForOrder() {
		let detectClickOnOrder = document.getElementById("order");
		let dataForm = document.querySelectorAll(
			"form .cart__order__form__question input"
		);
		let productIdInCart = cart.map((product) => product.id);
		let contact = {};

		detectClickOnOrder.addEventListener("click", async function (e) {
			e.preventDefault();

			let isValid = true;

			dataForm.forEach(function (data) {
				if (!data.value || !data.checkValidity()) {
					isValid = false;
					console.log("nooo");
				} else {
					let attributId = data.getAttribute("name");
					contact[attributId] = data.value;
					console.log(contact);
				}
			});

			if (isValid) {
				if (Array.isArray(productIdInCart)) {
					let order = await postOrder(contact, productIdInCart);
					window.location =
						"/front/html/confirmation.html?idOrder=" +
						order.orderId;
				}
			}
		});
	}
	getDataForOrder();

	async function postOrder(contact, productIdInCart) {
		let response = await fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				contact: contact,
				products: productIdInCart,
			}),
		});

		return await response.json();
	}
} else {
	let confirmation = document.getElementById("orderId");
	if (confirmation) {
		let urlPage = new URL(document.location.href); // récuperation des info de la page web active
		let idOrder = urlPage.searchParams.get("idOrder");
		confirmation.innerHTML = idOrder;
	}
}
