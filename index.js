const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios").create({ baseUrl: "" });
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

app.use(cors({
	origin: '*'
}));

app.get("/", (req, res) => {
	res.send("Hello, Worlds")
})

app.post("/add-to-cart", (req, res) => {
	console.log('req', req.body);
	axios.get(`https://codebyedgesite.myshopify.com/admin/api/2023-04/products/${req.body.productId}.json`,
		{
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': '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'
			},
		}
	)
		.then((response) => {
			// console.log("data", response.data);
			res.send(response.data);
		});
})

app.post("/create-cart", (req, res) => {
	console.log('req 1', req.body);
	const id = uuidv4();
	console.log('id', id)
	const data = {
		'variant': {
			'option1': id,
			'price': req.body.price,
			'inventory_policy': 'continue'
		}
	}

	axios.post(`https://codebyedgesite.myshopify.com/admin/api/2023-04/products/${req.body.productId}/variants.json`,
		data,
		{
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': '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'
			},
		}
	)
		.then((response) => {
			// console.log("data", response.data);
			res.send(response.data);
		});
})
app.listen(5000, () => console.log("Servier is listening to port 5000"));