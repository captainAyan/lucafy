import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

export const getMembers = asyncHandler(async (req, res, next) => {
  res.send("get members");
});

export const getMemberById = asyncHandler(async (req, res, next) => {
  res.send("get member by id");
});

export const addMember = asyncHandler(async (req, res, next) => {
  res.send("add member");
});

export const editMember = asyncHandler(async (req, res, next) => {
  res.send("edit member");
});
