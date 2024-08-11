import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";

function ensureEnvironmentVariable(name: string): string {
	const value = process.env[name];
	if (value === undefined) {
		throw new Error(`missing environment variable ${name}`);
	}
	return value;
}

const webhookSecret = ensureEnvironmentVariable("CLERK_WEBHOOK_SECRET");

const handleClerkWebhook = httpAction(async (ctx, request) => {
	const event = await validateRequest(request);
	if (!event) {
		return new Response("Error occured", {
			status: 400,
		});
	}
	switch (event.type) {
		case "user.created": // intentional fallthrough
		case "user.updated": {
			const existingUser = await ctx.runQuery(internal.users.getUser, {
				subject: event.data.id,
			});
			if (existingUser && event.type === "user.created") {
				console.warn(
					"Overwriting user",
					event.data.id,
					"with",
					event.data
				);
			}
			console.log("creating/updating user", event.data.id);
			await ctx.runMutation(internal.users.updateOrCreateUser, {
				username:
					`${event.data.first_name} ${event.data.last_name}`.trim(),
				imageUrl: event.data.image_url,
				email: event.data.email_addresses[0].email_address,
				clerkId: event.data.id,
			});
			break;
		}
		case "user.deleted": {
			// Clerk docs say this is required, but the types say optional?
			const id = event.data.id!;
			await ctx.runMutation(internal.users.deleteUser, { id });
			break;
		}
		default: {
			console.log("ignored Clerk webhook event", event.type);
		}
	}
	return new Response(null, {
		status: 200,
	});
});

const http = httpRouter();

http.route({
	path: "/clerk",
	method: "POST",
	handler: handleClerkWebhook,
});

async function validateRequest(
	req: Request
): Promise<WebhookEvent | undefined> {
	try {
		const payloadString = await req.text();
		const svixHeaders = {
			"svix-id": req.headers.get("svix-id")!,
			"svix-timestamp": req.headers.get("svix-timestamp")!,
			"svix-signature": req.headers.get("svix-signature")!,
		};
		const wh = new Webhook(webhookSecret);
		let evt: Event | null = null;
		try {
			evt = wh.verify(payloadString, svixHeaders) as Event;
		} catch (verificationError) {
			console.error("Error verifying webhook:", verificationError);
			return;
		}
		return evt as unknown as WebhookEvent;
	} catch (error) {
		console.error("Error in validateRequest:", error);
		return;
	}
}

export default http;
