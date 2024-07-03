


// jest.mock("./service.js");

// describe("Feedback Controller", () => {

//   describe("getfeedback", () => {
//     it("should return all feedback data with status 200", async () => {
//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       const mockFeedbackData = [{ id: 1, message: "Great service!" }];
//       getAllfeedback.mockResolvedValue(mockFeedbackData);

//       await getfeedback(req, res);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(mockFeedbackData);
//     });

//     it("should handle errors with status 500", async () => {
//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       getAllfeedback.mockRejectedValue(new Error("Database error"));

//       await getfeedback(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
//     });
//   });

// //   describe("createfeedback", () => {
// //     it("should create feedback with status 201", async () => {
// //       const req = {
// //         body: {
// //           name: "John Doe",
// //           feedbackType: "Positive",
// //           message: "Excellent service",
// //           phone: "1234567890",
// //           branch: "Main",
// //           email: "john@example.com",
// //         },
// //       };
// //       const res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };

// //       await createfeedback(req, res);

// //       expect(addFeedback).toHaveBeenCalledWith(req.body);
// //       expect(res.status).toHaveBeenCalledWith(201);
// //       expect(res.json).toHaveBeenCalledWith({ message: "SUCCES " });
// //     });

// //     it("should return 400 for incomplete request body", async () => {
// //       const req = {
// //         body: {
// //           name: "John Doe",
// //           feedbackType: "Positive",
// //           message: "",
// //           phone: "1234567890",
// //           branch: "Main",
// //           email: "john@example.com",
// //         },
// //       };
// //       const res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };

// //       await createfeedback(req, res);

// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: "Incomplet request body" });
// //     });

// //     it("should handle errors with status 500", async () => {
// //       const req = {
// //         body: {
// //           name: "John Doe",
// //           feedbackType: "Positive",
// //           message: "Great service",
// //           phone: "1234567890",
// //           branch: "Main",
// //           email: "john@example.com",
// //         },
// //       };
// //       const res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };

// //       addFeedback.mockRejectedValue(new Error("Database error"));

// //       await createfeedback(req, res);

// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
// //     });
// //   });

// //   describe("updateFeedback", () => {
// //     it("should update feedback with status 200", async () => {
// //       const req = {
// //         params: { id: "1" },
// //         body: { message: "Updated feedback" },
// //       };
// //       const res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };

// //       const updatedFeedback = { id: "1", message: "Updated feedback" };
// //       updateFeedbackAction.mockResolvedValue(updatedFeedback);

// //       await updateFeedback(req, res);

// //       expect(updateFeedbackAction).toHaveBeenCalledWith("1", req.body);
// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith(updatedFeedback);
// //     });

// //     it("should handle errors with status 500", async () => {
// //       const req = {
// //         params: { id: "1" },
// //         body: { message: "Updated feedback" },
// //       };
// //       const res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };

// //       updateFeedbackAction.mockRejectedValue(new Error("Update error"));

// //       await updateFeedback(req, res);

// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: "Update error" });
// //     });
// //   });

// });
