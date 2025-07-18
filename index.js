// @ts-check

const express = require("express");
const { find, func, data } = require("./functions");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/find", (req, res) => {
	const name = req.query.name;
	const limit = Number(req.query.limit) || 5;

	if (!name || typeof name !== "string") {
		return res.status(400).json({
			status: 400,
			message: "Missing or invalid 'name' query parameter",
			data: null,
		});
	}

	const result = find(name, limit);
	return res.status(200).json({ status: 200, data: result });
});

app.all("/list", (req, res) => {
	const limit = Number(req.query.limit) || 20;
	const result = data.slice(0, limit);

	return res.status(200).json({ status: 200, data: result });
});

app.all("/function", (req, res) => {
	const name = req.query.name;

	if (!name || typeof name !== "string") {
		return res.status(400).json({
			status: 400,
			message: "Missing or Invalid 'name' Query Parameter",
			data: null,
		});
	}

	const result = func(name);
	if (!result) {
		return res.status(404).json({
			status: 404,
			message: "Function Not Found",
			data: null,
		});
	}
	
	return res.status(200).json({ status: 200, data: result });
});

app.all("/function/:name", (req, res) => {
	const name = req.params.name;

	if (!name || typeof name !== "string") {
		return res.status(400).json({
			status: 400,
			message: "Missing or Invalid 'name' Route Parameter",
			data: null,
		});
	}

	const result = func(name);
	if (!result) {
		return res.status(404).json({
			status: 404,
			message: "Function Not Found",
			data: null,
		});
	}
	
	return res.status(200).json({ status: 200, data: result });
});

app.use((_, res) => {
	return res.status(404).json({
		status: 404,
		message: "Not Found",
	});
});

app.listen(PORT);
