const Express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = Express();

const getTodaysEntry = () => {
	const midnight = new Date();
	midnight.setHours(0, 0, 0, 0);
	const midnightTimestamp = midnight.getTime();

	// Check if the file exists
	const tiddlerPath = `./tiddlystore/${midnightTimestamp}.json`;

	if (fs.existsSync(tiddlerPath)) {
		// If it does, return it
		const tiddler_plainText = fs.readFileSync(tiddlerPath, "utf8");
		const tiddler = JSON.parse(tiddler_plainText);
		return {
			...tiddler,
			id: midnightTimestamp,
			newlyCreated: false,
		};
	} else {
		const now = new Date();

		const tiddler = {
			title: midnight.toString(),
			text: "",
			tags: ["Journal"],
			creator: "JoeyZero",
			modifier: "JoeyZero",
			type: "text/plain",
			created: now.getTime(),
			modified: now.getTime(),
			id: midnightTimestamp,
		};

		fs.writeFileSync(tiddlerPath, JSON.stringify(tiddler));
		return {
			...tiddler,
			newlyCreated: true,
		};
	}
};

app.use(cors());
app.use(bodyParser.json());

// Pass through to the static files
app.use(Express.static("./build"));

app.get("/posts/:tiddlerId", (req, res) => {
	const tiddlerId = req.params.tiddlerId;
	const tiddlerPath = `./tiddlystore/${tiddlerId}.json`;
	if (fs.existsSync(tiddlerPath)) {
		const tiddler_plainText = fs.readFileSync(tiddlerPath, "utf8");
		const tiddler = JSON.parse(tiddler_plainText);
		res.json(tiddler);
	} else {
		res.status(404).send("Not found");
	}
});

app.get("/posts", (req, res) => {
	const tiddlers = fs.readdirSync("./tiddlystore").map((tiddlerId) => {
		const tiddler_plainText = fs.readFileSync(
			`./tiddlystore/${tiddlerId}`,
			"utf8"
		);
		const tiddler = JSON.parse(tiddler_plainText);
		return {
			...tiddler,
			id: tiddlerId.split(".")[0],
		};
	});
	res.json(tiddlers);
});

app.post("/save", (req, res) => {
	const tiddler = getTodaysEntry();

	if (tiddler.newlyCreated === true) {
		res.status(200).send("OK");
		return;
	} else {
		tiddler.text = req.body.text;
		console.log(req.body);
		const tiddlerPath = `./tiddlystore/${tiddler.id}.json`;
		delete tiddler.newlyCreated;
		fs.writeFileSync(tiddlerPath, JSON.stringify(tiddler, null, 2));
		res.status(200).send("OK");
	}
});

app.get("/active", (req, res) => {
	const tiddler = getTodaysEntry();
	res.json(tiddler);
});

app.get("*", (req, res) => {
	console.log("Any path?");
	res.sendFile("./build/index.html");
});

app.listen(4445, () => {
	console.log("Server listening on port 4445");
});
