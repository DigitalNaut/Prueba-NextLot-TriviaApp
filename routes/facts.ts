import express from 'express';

import { getNewFact } from "../public/javascripts/controller";

const router = express.Router();

/* GET new Fact. */
router.get('/user/:userId/facts/new',
  async (req, res) => {
    const userId = parseInt(req.params.userId, 16);
    const newFact = await getNewFact(userId);
    res.send(newFact);
  });

export default router;
