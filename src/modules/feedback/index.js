import feedback from './src/modules/feedback/feedback.js';
import feedbackRouter from './src/modules/feedback/routes.js';
import { getFeedback } from '../feedback/controller.js';
import { get_feedback} from '../feedback/service.js';



module.exports = {
  feedbackConstants: constants,

  feedbackService: service,

  feedbackController: controller,

  feedbackRoutes: routes,

  feedback: feedback,
};
