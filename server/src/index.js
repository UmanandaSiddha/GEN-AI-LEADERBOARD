import express from "express";
import cron from "node-cron";
import cors from "cors";
import WebScrapper from "./utils/scrapper.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./utils/user.route.js";
import User from "./utils/user.model.js";

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Uncaught Exception`);

    process.exit(1);
});

dotenv.config();

function connectDatabase() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((data) => {
            console.log(`Mongodb connected ${data.connection.host}`);
        })
}

connectDatabase();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
        ];
        const isAllowed = allowedOrigins.includes(origin);
        callback(null, isAllowed ? origin : false);
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/users", userRoutes);

const BATCH_SIZE = 10;
let isScraping = false;

const scrapeEligibleUsers = async () => {
    if (isScraping) {
        console.log("Previous scraping still in progress. Skipping this run.");
        return;
    }

    isScraping = true;

    try {
        const users = await User.find({});
        const usersToScrape = users.filter(user => user.badges.length < 17);

        for (let i = 0; i < usersToScrape.length; i += BATCH_SIZE) {
            const batch = usersToScrape.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(user => WebScrapper(user.publicProfile)));
            console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
        }

        console.log("Completed web scraping for users");

    } catch (error) {
        console.error("An error occurred while scraping:", error.message);
    } finally {
        isScraping = false;
    }
}

// scrapeEligibleUsers();

cron.schedule(`0 * * * *`, async () => {
    await scrapeEligibleUsers();
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});