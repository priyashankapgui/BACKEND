import PageAccess from './pageAccess.js';

export const getPages = async (req, res) => {  
    try {
        const pages = await PageAccess.findAll();
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};