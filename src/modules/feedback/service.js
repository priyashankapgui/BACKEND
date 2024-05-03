import feedback from '../feedback/feedback.js';
import feedbackRouter from '../feedback/routes.js';
import sequelize from '../../../config/database.js';



  export const getAllFeedback = async () => {
    try {
      const allFeedback = await feedback.findAll();
      return allFeedback;
    } catch (error) {
      throw new Error('Error retrieving feedback: ' + error.message);
    }

    console.log ('hello');
  };

  export const addFeedback = async (feedbackData) => {
    try {
        const newFeedback = await feedback.create(feedbackData);
        return newFeedback;
      } catch (error) {
        throw new Error('Error creating feedback: ' + error.message);
      }

    
  };


