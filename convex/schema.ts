import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		username: v.string(),
		imageUrl: v.string(),
		email: v.string(),
	}).index("clerkId", ["clerkId"]),

	projects: defineTable({
		userId: v.id("users"),
		name: v.string(),
		url: v.string(),
		description: v.optional(v.string()),
	}).index("userId", ["userId"]),

	feedbacks: defineTable({
		projectId: v.id("projects"),
		name: v.string(),
		email: v.string(),
		content: v.string(),
		rating: v.number(),
	}).index("projectId", ["projectId"]),
});
