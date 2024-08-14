import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<SignIn
			forceRedirectUrl={process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL}
		/>
	);
}
