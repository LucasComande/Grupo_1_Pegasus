const path = require('path');
const fs = require('fs');

const productsFilePath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
// const listadoProductos = function () {
//     let listadoJson = fs.readFileSync(path.resolve(__dirname, '../data/products.json'),'utf-8');
//     return JSON.parse(listadoJson)
// }

const productsController ={
    index: function(req,res){
		// res.send(products);
        res.render('products');
    },

    detail: (req,res) => {
        let idProducto = req.params.id //id se refiere al :id
        const productosMostrar = products.find(el => el.id == idProducto); 
        res.render('products/detail', {productos: productosMostrar});
    },

	 create: function(req,res){
        res.render('admin/createForm');
    },
	// Create method to store
	store: (req, res) => {
		//accedes al id del ultimo elemento (0 no existiria) y le sumas 1 para los nuevos productos
		let newId = products[products.length-1].id + 1; 
		let newProduct = {
			id: newId,
			...req.body,   //Spred operator, si hay OL toma c propiedad y valor.. y los SEPARA.
			img1: "default-image.png"	
			//img1: req.file == undefined ? "default-image.png" : req.file.filename // Debe haber si no no se muestra nada.
		};  
		products.push(newProduct);
		let productsJSON = JSON.stringify(products, null, 2); //para que no quede todo en una linea.
		fs.writeFileSync(productsFilePath, productsJSON);
		res.redirect("/products");
	},

    productCart: function (req,res){
        res.render('products/productCart');
    },    

    edit: (req, res) => {
		let idProduct = req.params.id;
		let productoAMostrar = products.find(el => el.id == idProduct);
		res.render("admin/modifForm", {productToEdit: productoAMostrar})
	},

    update: (req, res) => {
		let id = req.params.id;
		let modifiedProducts = products.map(element => {    //retorna nuevo array con elemtnos modificados
			if (element.id == id) {
				return element = {
					id:id,
					...req.body,
					// name: req.body.name,
    				// description: req.body.description,
					// price: req.body.price,
					// color: req.body.color,
					// size: req.body.name,
					// category: req.body.category,
					// stock: req.body.stock,
					// gender: req.body.gender,
					// img2: req.body.img2,
					// img3: req.body.img3,
					// img4: req.body.img4
					img1: req.file == undefined ? element.img1 : req.file.filename //image siempre x fuera del body. Ya tenemos datos aca.				
				}
			}
			return element
		})	

		let productsJSON = JSON.stringify(modifiedProducts, null, 2); //para que no quede todo en una linea. Stringy porque lo de arriba esta en formatojson (OL)
		fs.writeFileSync(productsFilePath, productsJSON);
		res.redirect("/products");
	
	},

    destroy : (req, res) => {
		// let idProduct = req.params.id;
		// let productoEliminar = products.find(producto => producto.id == idProduct);
		// res.render('products', {productsToDelete: productoEliminar})
	}  
};


module.exports = productsController