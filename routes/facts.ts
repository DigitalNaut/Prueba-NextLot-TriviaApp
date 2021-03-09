import express from 'express';

import { getNewFact } from "../public/javascripts/controller";

const router = express.Router();

/* GET new Session ID. */
router.get('/facts\/new',
  async (_, res) => {
    const newFact = await getNewFact();
    res.send(newFact);
  });

router.get('/facts', (_, res) => { res.redirect('/facts\/new'); });

export default router;
