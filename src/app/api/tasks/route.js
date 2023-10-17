import { getResponseMessage } from "@/helper/responseMessage";
import { Task } from "@/models/task";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/helper/db";

//GET all the tasks
export async function GET(request) {
  try {
    await connectDB();
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return getResponseMessage("Error in getting data!!!", 404, false); //using customised response message
  }
}

//Create task
export async function POST(request) {
  const { title, content, userId, status } = await request.json();

  //Fetching logged in user id
  const authToken = request.cookies.get("authToken")?.value;
  const data = jwt.verify(authToken, process.env.JWT_KEY);

  try {
    const task = new Task({
      title,
      content,
      userId: data._id,
      status,
    });
    await connectDB();
    const createdTask = await task.save();
    return NextResponse.json(createdTask, {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to create task!!!",
      success: false,
    });
  }
}
