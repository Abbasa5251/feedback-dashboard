import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { userQuery } from "./users";

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
