import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { getCurrentUser } from '../controllers/userController';
import { getAllPolls, newPoll, votePoll } from '../controllers/Poll.js';


const PollRouter = express.Router()

PollRouter.post('/polls' ,isAuth , newPoll )
PollRouter.get('/polls' ,isAuth ,getAllPolls )
PollRouter.post('/polls/:id/vote' ,isAuth ,votePoll )


export default PollRouter