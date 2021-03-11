import express from 'express';
import cors from 'cors';

import { getNewFact } from "../public/javascripts/controller";

const router = express.Router();

/* GET new Fact. */
router.get('/user/:userId/facts/new', cors(),
  async (req, res) => {
    const userId = parseInt(req.params.userId, 12);
    const newFact = await getNewFact(userId);

    console.log("Response:", newFact.status);
    res.send(newFact);
  });

export default router;
