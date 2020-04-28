const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoDb = require('mongodb');
const app = express();
const mongoUrl = 'mongodb+srv://urldb:urldb@cluster0-nvqfd.mongodb.net/test?retryWrites=true&w=majority';

app.use(cors());
app.use(bodyParser.json());

function generateUrl() {
	let str = 'QWERTYUIIOPASDFGHJKLZXCVBNMasdfghjklzxcvbnmqwertyuiop123456789';
	let len = str.length;
	let empty = '';
	for (let i = 0; i < 4; i++) {
		empty += str.charAt(Math.floor(Math.random() * len));
	}
	return empty;
}

app.post('/', (req, res) => {
	mongoDb.connect(mongoUrl, (err, client) => {
		if (err) throw err;
		const db = client.db('urlDemo');
		let urlObj = {
			short: generateUrl(),
			long: req.body.url
		};
		db.collection('urlShort').insertOne(urlObj, (err, data) => {
			if (err) throw err;
			client.close();
			res.json({
				message: 'success'
			});
		});
	});
});

app.get('/url', (req, res) => {
	mongoDb.connect(mongoUrl, (err, client) => {
		if (err) throw err;
		const db = client.db('urlDemo');
		let userdata = db.collection('urlShort').find().toArray();
		userdata
			.then((data) => {
				client.close();
				res.json(data);
			})
			.catch((err) => {
				client.close();
				res.status(500).json({
					message: err
				});
			});
	});
});

app.listen(process.env.PORT, () => {
	console.log('App listening ');
});
