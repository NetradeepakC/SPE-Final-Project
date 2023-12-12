import dotenv from "dotenv";

dotenv.config();

export const config = {
	production: {
		dbUrl: process.env.PROD_DB_URL,
	},
	test: {
		dbUrl: process.env.TEST_DB_URL,
	},
};