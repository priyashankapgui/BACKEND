// main.js
import express from "express";
import { getAllFeedback , addFeedback } from "./service.js";


export const createfeedback = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.feedbackType ||
      !req.body.message ||
      !req.body.phone ||
      !req.body.email
    ) {
      return res.status(400).json({ error: "Incomplet request body" });
    }
    await addFeedback(req.body);
    res.status(201).json({ message: "SUCCES " });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getFeedback = async (req, res) => {
  try {
    const feedbackData = await getAllFeedback();
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
