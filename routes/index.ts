import { Router } from 'express';
import cors from 'cors';

import users from "./users";
import facts from "./facts";

const router = Router();

/* GET home page. */
router.get('/', cors(),
  (_, res) => {
    res.render('index', { title: 'Express' });
  });

router.get('/user/*', cors(), users);
router.get('/user/:userId/facts*', cors(), facts);

export default router;
