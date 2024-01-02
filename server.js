const Express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const app = Express();
const dotenv = require("dotenv");

dotenv.config();

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.S3_REGION,
});

const s3 = new AWS.S3();

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

		// Upload to S3
		const params = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `${tiddler.id}.json`,
			Body: JSON.stringify(tiddler, null, 2),
		};

		s3.upload(params, function (err, data) {
			if (err) {
				console.log("Error", err);
			}
			if (data) {
				console.log("Upload Success", data.Location);
			}
		});
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
