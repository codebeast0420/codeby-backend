const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios").create({ baseUrl: "" });
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config(); // Load environment variables from .env file

async function GetGoogleSheetRows() {
	try {
		// Create a new JWT client using your service account credentials
		const serviceAccountAuth = new JWT({
			email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});

		// Create a new GoogleSpreadsheet instance and authenticate
		const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

		// Load the document information
		await doc.loadInfo();

		// Access the first sheet
		const sheet = doc.sheetsByIndex[1];

		// Get all rows from the sheet
		const rows = await sheet.getRows(); // This fetches all rows
		console.log("count", sheet.rowCount);

		// Map the rows into a more usable format (e.g., converting each row to a plain object)
		// console.log("rows", rows);
		const rowsData = rows.map((row, index) => {
			const rowData = {};
			sheet.headerValues.forEach(header => {
				rowData[header] = row.get(header);
			});
			return rowData;
		});

		return rowsData;
	} catch (error) {
		console.error('Failed to access Google Sheets API:', error);
		return null;
	}
}


const app = express();
app.use(bodyParser.json());

app.use(cors({
	origin: '*'
}));

const url = 'https://api.urlbox.io/v1/render/sync';

app.post("/mail", async (req, res) => {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'saintjohn0420@gmail.com',
			pass: 'npklrlxiwppyfpus',
		}
	});
	let mailOptions = {
		from: req.body.from,
		to: 'codebeast0420@gmail.com, hello@codebyedge.com, david.evans@codebyedge.com',
		subject: 'Contact from codeby edge',
		text: req.body.text
	};

	await transporter.sendMail(mailOptions);
	res.send('success');
})

app.post("/screenshot", async (req, res) => {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.URLBOX_KEY}` },
		body: JSON.stringify({ format: 'png', full_page: true, url: req.body.url })
	};
	try {
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(data);
		res.json(data);
	} catch (error) {
		console.error(error);
	}
});

app.get("/", (req, res) => {
	res.send("Hello, Worlds")
})

app.get("/get-sheet", async (req, res) => {
	console.log('here');
	const doc = await GetGoogleSheetRows();
	res.send(doc);
})

app.post("/add-to-cart", (req, res) => {
	console.log('req', req.body);
	axios.get(`https://codebyedgesite.myshopify.com/admin/api/2023-04/products/${req.body.productId}.json`,
		{
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': process.env.SHOPIFY_KEY
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
				'X-Shopify-Access-Token': process.env.SHOPIFY_KEY
			},
		}
	)
		.then((response) => {
			// console.log("data", response.data);
			res.send(response.data);
		});
})

app.post("/get-ip", async (req, res) => {
	console.log(req.body.ip);
	await axios.get(`https://api.ip2location.io/?key=56A36D62B0A865152FCA3E403509F575&ip=${req.body.ip.ip}`).then((data) => {
		// console.log(data.data.ip);
		res.send(data.data);
	})
})
app.listen(5000, () => console.log("Servier is listening to port 5000"));