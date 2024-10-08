import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userQuery } from "./users";

export const getProjects = query({
	args: {},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Not authenticated");
		}
		const userRecord = await userQuery(ctx, identity.subject);

		if (userRecord === null) {
			throw new ConvexError("User not found");
		}

		return await ctx.db
			.query("projects")
			.withIndex("userId", (q) => q.eq("userId", userRecord._id))
			.collect();
	},
});

export const getProject = query({
	args: {
		projectId: v.id("projects"),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Not authenticated");
		}
		const userRecord = await userQuery(ctx, identity.subject);

		if (userRecord === null) {
			throw new ConvexError("User not found");
		}

		return await ctx.db
			.query("projects")
			.withIndex("userId", (q) => q.eq("userId", userRecord._id))
			.filter((q) => q.eq(q.field("_id"), args.projectId))
			.unique();
	},
});

export const createProject = mutation({
	args: {
		name: v.string(),
		url: v.string(),
		description: v.optional(v.string()),
	}, // no runtime validation, trust Clerk
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Not authenticated");
		}
		const userRecord = await userQuery(ctx, identity.subject);

		if (userRecord === null) {
			throw new ConvexError("User not found");
		}

		const projectId = await ctx.db.insert("projects", {
			name: args.name,
			description: args.description,
			url: args.url,
			userId: userRecord._id,
		});

		return projectId;
	},
});
