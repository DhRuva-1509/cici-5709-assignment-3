import express from 'express';
import { getChatHistory } from '../controllers/chat.controller.ts';

const router = express.Router();

router.get('/:roomId', getChatHistory);

export default router;
