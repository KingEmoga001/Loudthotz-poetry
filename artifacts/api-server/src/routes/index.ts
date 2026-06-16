import { Router, type IRouter } from "express";
import healthRouter from "./health";
import poemsRouter from "./poems";
import submissionsRouter from "./submissions";
import livestreamRouter from "./livestream";
import booksRouter from "./books";
import donationsRouter from "./donations";
import statsRouter from "./stats";
import uploadsRouter from "./uploads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(poemsRouter);
router.use(submissionsRouter);
router.use(livestreamRouter);
router.use(booksRouter);
router.use(donationsRouter);
router.use(statsRouter);
router.use(uploadsRouter);

export default router;
