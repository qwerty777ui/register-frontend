import { object, string } from "zod";

export const PostApplicationSchema = object({
    message: string().trim().min(20, { message: "Message is required" }),
})

export const ReplyApplicationSchema = object({
    response: string().trim().min(20, { message: "Response is required" }),
})