import {
	internalMutation,
	internalQuery,
	query,
	QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
	async (
		ctx
	): Promise<
		| ["No JWT Token", null]
		| ["No Clerk User", null]
		| ["Logged In", Doc<"users">]
	> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			// no JWT token, user hasn't completed login flow yet
			return ["No JWT Token", null];
		}
		const user = await getCurrentUser(ctx);
		if (user === null) {
			// If Clerk has not told us about this user we're still waiting for the
			// webhook notification.
			return ["No Clerk User", null];
		}
		return ["Logged In", user];
	}
);

/** The current user, containing user preferences and Clerk user info. */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const getUser = internalQuery({
	args: { subject: v.string() },
	async handler(ctx, args) {
		return await userQuery(ctx, args.subject);
	},
});

/** Create a new Clerk user or update existing Clerk user data. */
export const updateOrCreateUser = internalMutation({
	args: {
		username: v.string(),
		imageUrl: v.string(),
		clerkId: v.string(),
		email: v.string(),
	}, // no runtime validation, trust Clerk
	async handler(ctx, args) {
		const userRecord = await userQuery(ctx, args.clerkId);

		if (userRecord === null) {
			await ctx.db.insert("users", args);
		} else {
			await ctx.db.patch(userRecord._id, args);
		}
	},
});

/** Delete a user by clerk user ID. */
export const deleteUser = internalMutation({
	args: { id: v.string() },
	async handler(ctx, { id }) {
		const userRecord = await userQuery(ctx, id);

		if (userRecord === null) {
			console.warn("can't delete user, does not exist", id);
		} else {
			await ctx.db.delete(userRecord._id);
		}
	},
});

// Helpers

export async function userQuery(ctx: QueryCtx, clerkUserId: string) {
	return await ctx.db
		.query("users")
		.withIndex("by_clerkId", (q) => q.eq("clerkId", clerkUserId))
		.unique();
}

export async function userById(ctx: QueryCtx, id: Id<"users">) {
	return await ctx.db.get(id);
}

async function getCurrentUser(ctx: QueryCtx) {
	const identity = await ctx.auth.getUserIdentity();
	if (identity === null) {
		return null;
	}
	return await userQuery(ctx, identity.subject);
}

export async function mustGetCurrentUser(ctx: QueryCtx) {
	const userRecord = await getCurrentUser(ctx);
	if (!userRecord) throw new Error("Can't get current user");
	return userRecord;
}
