import "./globals.css";
import PageHeader from "@/components/page-header";
import ConvexClientProvider from "@/providers/convex-clerk-provider";

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
				</ConvexClientProvider>
			</body>
		</html>
	);
}
