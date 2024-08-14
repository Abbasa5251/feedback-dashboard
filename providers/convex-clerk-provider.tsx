"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import {
	Authenticated,
	ConvexReactClient,
	Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

type Props = {
	children: React.ReactNode;
};
const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string
);

function ConvexClientProvider({ children }: Props) {
	return (
		<ClerkProvider>
			<ConvexProviderWithClerk useAuth={useAuth} client={convex}>
				{children}
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}

export default ConvexClientProvider;
