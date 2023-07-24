const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios").create({ baseUrl: "" });
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

app.use(cors({
	origin: '*'
}));

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'codebeast0420',
//     pass: 'codebeast0420!@#'
//   }
// });

// var mailOptions = {
//   from: 'codebeast0420@gmail.com',
//   to: 'johnleedevlead@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

app.get("/mail", async (req, res) => {
	let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'codebeast0420@gmail.com',
      pass: 'codebeast0420!@#',
      clientId: '285817227208-submk3onndptffg48ginmqvlsev80on8.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04RSvXBLYHsOhCgYIARAAGAQSNwF-L9IrY-PFg_tl8kykAoZD8hJrnBLFSyyQHxrLNTV5eQvgxdWWphbqILeMOIrSXnRgLiiq_9g'
    }
  });
  let mailOptions = {
    from: 'codebeast@gmail.com',
    to: 'codebeast0420@gmail.com, hello@codebyedge.com, david.evans@codebyedge.com',
    subject: 'Contact from codeby edge',
    text: 'hello'
  };

  await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
	res.send('success');
})

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

app.post("/get-ip", async (req, res) => {
	console.log(req.body.ip);
	await axios.get(`https://api.ip2location.io/?key=56A36D62B0A865152FCA3E403509F575&ip=${req.body.ip.ip}`).then((data) => {
		// console.log(data.data.ip);
		res.send(data.data);
	})
})
app.listen(5000, () => console.log("Servier is listening to port 5000"));