import cors from 'cors';
import express from 'express';
import UserModel from '../public/javascripts/db/User.model';

import { getUserFacts, getNewUser } from "../public/javascripts/db/database";

const router = express.Router();

function handleError(error: unknown) {
  console.error("[User route]", error);
}

/* GET new User ID. */
router.get('/user/new', cors(),
  async (_, res) => {
    const newUser = await getNewUser();
    if (newUser)
      res.status(200).json({ userId: newUser.id });
    else
      res.status(400);
  });

export default router;
