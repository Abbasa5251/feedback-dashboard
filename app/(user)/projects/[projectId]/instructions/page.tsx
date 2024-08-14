import React from "react";
import CopyButton from "@/components/copy-button";

type Props = {
	params: {
		projectId: string;
	};
};

function InstructionsPage({ params: { projectId } }: Props) {
	return (
		<div>
			<h1 className="text-xl font-bold mb-2">
				Start Collecting Feedback
			</h1>
			<p className="text-lg text-secondary-foreground">
				Embed the code in your site
			</p>
			<div className="bg-blue-950 p-6 rounded-md mt-6 relative">
				<code className="text-white">
					{`<my-widget project-id="${projectId}"></my-widget>`}
					<br />
					{`<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/widget.umd.js"></script>`}
				</code>
				<CopyButton
					text={`<my-widget project="${projectId}"></my-widget>\n<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/widget.umd.js"></script>`}
				/>
			</div>
		</div>
	);
}

export default InstructionsPage;
