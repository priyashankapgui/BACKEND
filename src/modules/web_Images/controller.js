import express from "express";
import {imageUpload}  from "./service.js"; 
import multer from 'multer';
import path from 'path';

export const createwebImage = async (req, res) => {
  console.log("controler");
    try {
        if (!req.files) {
            return res.status(400).json({ error: "Incomplete request body" });
        }
        await imageUpload(req);
        res.status(201).json({ message: "SUCCESS" });
    } catch (error) {
        console.error("Error adding Image:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
