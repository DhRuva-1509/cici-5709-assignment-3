import { Server } from 'socket.io';
import { Chat } from '../models/chat.model.ts';

interface MessagePayload {
    roomId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp?: Date;
}

export const handleSocketConnection = (io: Server) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Room join event
        socket.on('join_room', (roomId: string) => {
            console.log(`${socket.id} joining room: ${roomId}`);
            socket.join(roomId);
            socket.emit('joined_room', { roomId, message: `You joined ${roomId}` });
        });

        // Send message event
        socket.on('send_message', async (data: MessagePayload) => {
            console.log(`Message received from ${data.senderId} to ${data.receiverId} in ${data.roomId}`);
            console.log(`Content: ${data.content}`);

            try {
                const newMsg = new Chat({ ...data, timestamp: new Date() });
                await newMsg.save();
                console.log(`Message saved to DB`);

                io.to(data.roomId).emit('receive_message', newMsg);
                console.log(`Message broadcasted to room ${data.roomId}`);
            } catch (err) {
                console.error(`Error saving message: ${err}`);
                socket.emit('error_saving_message', { error: 'Failed to save message' });
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
