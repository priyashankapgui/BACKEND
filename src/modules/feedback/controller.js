// main.js
import express from "express";
import { getAllfeedback, addFeedback,  updateFeedbackAction } from "./service.js";

export const getfeedback = async (req, res) => {
  try {
    const feedbackData = await getAllfeedback();
    res.status(200).json(feedbackData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createfeedback = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.feedbackType ||
      !req.body.message ||
      !req.body.phone ||
      !req.body.branch||
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

export const updateFeedback = async (req, res) => {
  try {
      const { id } = req.params;
      const updatedFeedback = await updateFeedbackAction(id, req.body);
      res.status(200).json(updatedFeedback);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
