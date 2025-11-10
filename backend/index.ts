import "dotenv/config";
import app from "./app.ts";
import connectDB from "./db/index.ts";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
});

