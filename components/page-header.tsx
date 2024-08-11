import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";

function PageHeader() {
	return (
		<header className="sticky inset-x-0 top-0 z-30 w-full transition-all">
			<div className="w-full max-w-screen-xl px-2.5 lg:px-20 relative mx-auto  border-b">
				<div className="flex h-14 items-center justify-between">
					<h1 className="">ADev Feedback</h1>
					<div>
						<SignedOut>
							<div className="flex items-center justify-center gap-2">
								<SignInButton>
									<Button className="bg-black">
										Sign In
									</Button>
								</SignInButton>
								<SignUpButton>
									<Button className="bg-black">
										Sign Up
									</Button>
								</SignUpButton>
							</div>
						</SignedOut>
						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</div>
			</div>
		</header>
	);
}

export default PageHeader;
