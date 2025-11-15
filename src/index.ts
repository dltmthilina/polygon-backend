import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

app.get("/", (_req, res) => {
	res.json({ ok: true });
});

const start = async () => {
	try {
		await sequelize.authenticate();
		console.log("Database connection established ✔");
		app.listen(port, () => {
			console.log(`Server listening on http://localhost:${port}`);
		});
	} catch (err) {
		console.error("Unable to connect to the database:", err);
		process.exit(1);
	}
};

start();