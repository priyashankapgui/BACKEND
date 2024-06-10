import {
    registerCustomer,
    getCustomerById,
    loginCustomerService,
    
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

export const handleLoginCustomer = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    try {
      const result = await loginCustomerService(email, password);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: error.message });
    }
  };
