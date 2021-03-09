import express from 'express';

import { getUserFacts } from "../public/javascripts/db/database";

const router = express.Router();

/* GET new User ID. */
router.get('/user/:userId/facts',
  (req, res) => {
    // UserModel.

    res.send(
      req.params.userId
    );
  });

export default router;
