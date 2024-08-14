"use client";
import { CircleCheck, Clipboard } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const CopyButton = ({ text }: { text: string }) => {
	const [isCopied, setIsCopied] = useState(false);
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setIsCopied(true);
			toast.success("Code snippet copied!");
		});
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={() => copyToClipboard(text)}
						className="text-slate-50 hover:bg-slate-700 absolute p-2 right-4 top-4"
						size={"icon"}
					>
						{isCopied ? (
							<CircleCheck className="h-3 w-3" />
						) : (
							<Clipboard className="h-3 w-3" />
						)}
						<span className="sr-only">Copy to clipboard</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Copy</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyButton;
