import feedback from '../feedback/feedback.js';
import feedbackRouter from '../feedback/routes.js';
import sequelize from '../../../config/database.js';



export const getAllfeedback = async () => {
    // try {
    //   const productsReq = await feedback.findAll();
    //   console.log(productsReq);
    //   return productsReq;
    // } catch (error) {
    //   console.error('Error retrieving products:', error);
    //   throw new Error('Error retrieving products');
    // }

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


