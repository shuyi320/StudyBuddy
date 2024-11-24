//This file describes all the routes for creating/modifying users
import express from 'express';

//Import functionality
import { getExistingUsers, getUserInfo, getUserFriend, setDisplayName, addFriend, getFriends, joinEvent, getUserInfoByName } from '../Controllers/userController.js';

const router = express.Router();

// POST routes
router.post('/relationships', addFriend);
router.post('/:id/displayName', setDisplayName);

// GET routes
router.get('/', getExistingUsers);
router.get('/:username', getUserInfoByName);
router.get('/relationships/:userId', getFriends);
router.get('/:id', getUserInfo); // This route gets the current user's information
router.get('/relationships/:friendId', getUserFriend); // This route could potentially return chat data between users
router.post('/addFriend', addFriend);

export default router; 