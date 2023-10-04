import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.post('/api/signup', async (req, res) => {
    // Your API logic here
    try {
        const { username, password } = req.body;
        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Invalid request data" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                username: username as string,
                hashedPassword
            }
        });
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: "an error occurred"});
    }
});

app.post('/api/login', async (req, res) => {
    // Your API logic here
    try {
        const { username, password } = req.body;
        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Invalid request data" });
        }
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordMatch) {
            console.log("Password incorrect");
            return res.status(401).json({ error: "Password incorrect" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        // Set the JWT in a cookie
        res.cookie('jwt', token, { httpOnly: true,
            secure: true,
            sameSite: "none",});
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: "an error occurred"});
    }
});

app.post("/api/createPlayground", async (req, res) => {
    const token = req.cookies.jwt;
    const { title, userId } = req.body;
    if (typeof title !== "string" || typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid request data" });
    }
    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log(decoded);
        const playground = await prisma.playground.create({
            data: {
                title,
                userId
            }
        });
        return res.status(200).json(playground);
    } catch (e) {
        console.log(e);
        return res.status(401).json({ error: 'Token not verified' });
    }
});

app.get("/api/playground/:playgroundId", async (req, res) => {
    const {playgroundId} = req.params;
    const questions = await prisma.question.findMany({
        where: {
            playgroundId
        }
    });
    res.status(200).json(questions)
});

app.get("/api/me", async (req, res) => {
    const token = req.cookies.jwt;
    // console.log(req.cookies);
    if(!token || typeof token !== "string") {
        return res.status(401).json({ error: "Unauthorized login again" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await prisma.user.findUnique({
            where:{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                id: data.userId as string
            }
        });
        res.status(200).json(user);
    } catch (e) {
        console.log(e);
        res.status(401).json({ error: "Token error login again" });
    }
    // res.status(401).json({ error: "Token error login again" })
});

const server =  app.listen(3001, () => {
        console.log(`Server running on PORT ${3001}...`);
    }
);

// Create a WebSocket server
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('create-question', async (body) => {
        // console.log(body);
        const question = await prisma.question.create({
            data: {
                body: body.text,
                playgroundId: body.playgroundId,
                upvotes: []
            }
        })
        io.emit('question-update', question);
    });

    socket.on('upvote', async (data) => {
        // console.log(data)
        try {
            const updatedQuestion = await prisma.question.update({
                where: {
                    id: data.questionId,
                },
                data: {
                    upvotes: {
                        push: data.userId,
                    },
                },
            });

            io.emit('upvoteUpdate', updatedQuestion);
        } catch (error) {
            console.error('Error when upvoting:', error);
        }
    });

    socket.on('downvote', async (data) => {
        try {
            const question = await prisma.question.findUnique({
                where: {
                    id: data.questionId,
                },
            });

            if (question) {
                const updatedQuestion = await prisma.question.update({
                    where: {
                        id: data.questionId,
                    },
                    data: {
                        upvotes: {
                            set: question.upvotes.filter((userId) => userId !== data.userId),
                        },
                    },
                });

                io.emit('downvoteUpdate', updatedQuestion);
            }
        } catch (error) {
            console.error('Error when downvoting:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

