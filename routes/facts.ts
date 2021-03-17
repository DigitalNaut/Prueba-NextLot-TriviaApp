import express from 'express';
import cors from 'cors';

import { fetchNewFact, Language } from "../public/javascripts/controller";
import { Types } from 'mongoose';
import { getUserFacts } from '../public/javascripts/db/database';

const router = express.Router();


/* GET new Fact in a Language */
router.get('/user/:userId/facts/new/lang/:langId', cors(),
  async (req, res) => {
    const userId = req.params.userId;
    const langId = req.params.langId.toUpperCase();

    const language = Language[langId as keyof typeof Language]; // String to enum conversion for url param

    const newFact = await fetchNewFact(userId, language);

    console.log(`Trivia API responded with Fact in ${language}:`, newFact.fact);
    res.status(200).send(newFact);

  });

/* GET new Fact in any language */
router.get('/user/:userId/facts/new', cors(),
  async (req, res) => {
    // Create new Id
    const userId = req.params.userId;

    // Fetch fact from controller
    const newFact = await fetchNewFact(userId);

    // Display result
    console.log(`Trivia API responded with Fact:`, newFact.fact);
    res.status(200).send(newFact);
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
