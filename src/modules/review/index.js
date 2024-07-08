// review/index.js

import * as reviewService from './service.js';
import * as reviewController from './controller.js';
import reviewRouter from './reviewRoutes.js';
import Review from './review.js';

export default {
    Controller: reviewController,
    Service: reviewService,
    Routes: reviewRouter,
    Model: Review,
};
