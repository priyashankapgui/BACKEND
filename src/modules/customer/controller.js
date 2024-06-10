import {
    registerCustomer,
    getCustomerById
    
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

export const getCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    try {
        const customer = await getCustomerById(customerId);
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// export const handleLogin = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//       const user = await handleLoginCustomer(email, password);
//         return res.status(200).json(user);
//     }
//     catch (error) {
//         return res.status(400).json({ message: error.message });
//     }
// }

