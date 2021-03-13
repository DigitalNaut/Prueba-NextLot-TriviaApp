import cors from 'cors';
import express from 'express';

import { getNewUserID } from "../public/javascripts/db/database";

const router = express.Router();

/* GET new User ID. */
router.get('/user/new', cors(),
  async (_, res) => {
    const newUserID = await getNewUserID();
    if (newUserID)
      res.status(200).json({ userId: newUserID });
    else
      res.status(400);
  });

export default router;
