import { ConvexError, v } from "convex/values";
import { query, httpAction, internalMutation } from "./_generated/server";
import { userQuery } from "./users";
import { internal } from "./_generated/api";

export const getFeedbacksForProject = query({
	args: {
		projectId: v.id("projects"),
	},
	async handler(ctx, { projectId }) {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Not authenticated");
		}
		const userRecord = await userQuery(ctx, identity.subject);

		if (userRecord === null) {
			throw new ConvexError("User not found");
		}

		return await ctx.db
			.query("feedbacks")
			.withIndex("projectId", (q) => q.eq("projectId", projectId))
			.collect();
	},
});

export const addFeedback = internalMutation({
	args: {
		projectId: v.id("projects"),
		email: v.string(),
		name: v.string(),
		content: v.string(),
		rating: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("feedbacks", {
			email: args.email,
			name: args.name,
			content: args.content,
			projectId: args.projectId,
			rating: args.rating,
		});
	},
});

export const handleFeedback = httpAction(async (ctx, request) => {
	const { email, name, feedback, rating, projectId } = await request.json();

	await ctx.runMutation(internal.feedbacks.addFeedback, {
		email,
		name,
		rating,
		projectId,
		content: feedback,
	});

	return new Response(null, {
		status: 200,
	});
});
