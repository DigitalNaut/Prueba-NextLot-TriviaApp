import { Router } from 'express';

import users from "./users";
import facts from "./facts";

const router = Router();

/* GET home page. */
router.get('/',
  (req, res, next) => {
    res.render('index', { title: 'Express' });
  });

router.get('/user/:userId/facts*', facts);
router.get('/user/:userId*', users);

export default router;
