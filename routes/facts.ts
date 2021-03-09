import express from 'express';

import { getNewFact } from "../public/javascripts/controller";

const router = express.Router();

/* GET new Session ID. */
router.get(/\/facts\/new/,
  (_, res) => {
    res.send("Hi");
  });

router.get('/facts', (_, res) => { res.redirect('/facts\/new'); });


export default router;
