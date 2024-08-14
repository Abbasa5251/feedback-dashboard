import "./globals.css";
import PageHeader from "@/components/page-header";
import ConvexClientProvider from "@/providers/convex-clerk-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ConvexClientProvider>
					<PageHeader />
					{children}
					<Toaster richColors position="top-center" />
				</ConvexClientProvider>
			</body>
		</html>
	);
}
