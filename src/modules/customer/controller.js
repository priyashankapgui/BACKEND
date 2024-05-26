import {
    registerCustomer,
    
} from "../customer/service.js";       

export const registerNewCustomer = async (req, res) => {
    const customer = req.body;
    try {
        const newCustomer = await registerCustomer(customer);
        res.status(201).json({
            message: "Customer created successfully",
            customer: newCustomer,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};



