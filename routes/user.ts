import express from 'express';

import { newSessionID } from "../public/javascripts/sessions";

const router = express.Router();

router.get('/session', (_, res, next) => {
  res.redirect('/session/new');
});

/* GET new Session ID. */
router.get('/session\/new',
  (_, res) => {
    res.send({
      message: "Hello!"
    });
  });

export default router;
