import express from 'express';
import cors from 'cors';

import { getNewFact, Languages } from "../public/javascripts/controller";
import { Types } from 'mongoose';
import { getUserFacts } from '../public/javascripts/db/database';

const router = express.Router();

export function handleError(error: Error) {
  console.error("Error while manipulating facts:", error);
}

/* GET new Fact. */
router.get('/user/:userId/facts/new', cors(),
  async (req, res) => {
    // Create new Id
    const userId = req.params.userId;

    // Fetch fact from controller
    const newFact = await getNewFact(userId, Languages.en);

    // Display result
    console.log("Response:", newFact);
    res.send(newFact);
  });

router.get('/user/:userId/facts/all', cors(),
  async (req, res) => {
    // Check if given userId is valid
    const userId = req.params.userId;
    if (!Types.ObjectId.isValid(userId))
      res.status(400);

    // Fetch the UserFacts documents
    const userFacts = await getUserFacts(userId);

    // Successfull fetch
    res.status(200).json({ facts: userFacts });
  });

export default router;
