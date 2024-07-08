import {
    registerCustomer,
    getCustomerById,
    loginCustomerService,
    resetPasswordEmail,
    updateCustomerService,
    updatePasswordService,
} from "../customer/service.js";  

export const registerNewCustomer = async (req, res) => {
    const customer = req.body;
    console.log(customer);
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

export const updateCustomer = async (req , res) => {
    const customerId = req.params.customerId;
    const updatedCustomerData = req.body;
    console.log(updatedCustomerData);
    try {
        const updatedCustomer = await updateCustomerService(
            customerId,
            updatedCustomerData
        );
        if (!updatedCustomer) {
            res.status(404).json({ message: "Couldn't Update the Customer" });
            return;
        }
        res.status(200).json(updatedCustomer);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    const customerId = req.params.customerId;
    const { oldPassword, newPassword } = req.body;
    try {
      const updatedCustomer = await updatePasswordService(
        customerId,
        oldPassword,
        newPassword
      );
      if (!updatedCustomer) {
        res.status(404).json({ message: "Couldn't Update the Password" });
        return;
      }
      res.status(200).json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const handleLoginCustomer = async (req, res) => {
    const { email, password } = req.body;
    const returnHostLink = req.get('origin');
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    try {
      const result = await loginCustomerService(email, password, returnHostLink);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(error.status || 500).json({ message: error.message });
    }
  };

export const forgotPasswordCustomer = async (req, res) => {
    const { email } = req.body;
    const returnHostLink = req.get('origin');

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    try {
        const result = await resetPasswordEmail(email, "template_resetpw509",returnHostLink);
        return res.status(200).json(result);    
    } catch (error) {
      return res.status(500).json({ message: error.message});
    }
  }

export const verifyToken = async (req, res) => {
    res.status(200).json({ message: "Valid Token" });
}
