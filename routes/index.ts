import { Router } from 'express';
import cors from 'cors';

import users from "./users";
import facts from "./facts";

const router = Router();

/* GET home page. */
router.get('/',
  (req, res, next) => {
    res.render('index', { title: 'Express' });
  });

router.get('/user/:userId/facts*', cors(), facts);
router.get('/user/:userId*', cors(), users);

export default router;
