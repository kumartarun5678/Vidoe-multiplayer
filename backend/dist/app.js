import express from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocketHandlers } from './utils/socket.js';
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"]
    }
});
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
// Routes
import { gridRoutes, playerRoutes, historyRoutes } from "./routes/index.js";
app.use('/api/v1/grid', gridRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/history', historyRoutes);
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
setupSocketHandlers(io);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export { app, io };
