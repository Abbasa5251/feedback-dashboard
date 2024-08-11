import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		username: v.string(),
		imageUrl: v.string(),
		clerkId: v.string(),
		email: v.string(),
	}).index("by_clerkId", ["clerkId"]),

	projects: defineTable({
		name: v.string(),
		url: v.string(),
		description: v.optional(v.string()),
		user: v.id("users"),
	}),
});
