//Page produits

let urlPage = new URL(document.location.href)
let idProduct = urlPage.searchParams.get('id')

const displayProduct = async() =>{
    fetch("http://localhost:3000/api/products/"+idProduct)
    .then(async (datas) => {
        let ok = await datas.json()

        console.log(ok)
    })
}

displayProduct()
