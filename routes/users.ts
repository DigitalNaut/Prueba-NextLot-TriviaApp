import express from 'express';

import UserModel from "../public/javascripts/db/User.model";

const router = express.Router();

/* GET new User ID. */
router.get('/user/:userId',
  (req, res) => {
    res.send(
      req.params
    );
  });

export default router;
