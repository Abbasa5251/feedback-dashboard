"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useQuery } from "convex/react";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Link from "next/link";

type Props = {
	params: {
		projectId: string;
	};
};

function ProjectPage({ params: { projectId } }: Props) {
	const feedbacks = useQuery(api.feedbacks.getFeedbacksForProject, {
		projectId: projectId as Id<"projects">,
	});
	const project = useQuery(api.projects.getProject, {
		projectId: projectId as Id<"projects">,
	});

	return (
		<div>
			<h1>Project Page - {project?.name}</h1>
			<Link href={`/projects/${projectId}/instructions`}>Embed Code</Link>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Message</TableHead>
						<TableHead>Created date</TableHead>
						<TableHead className="text-right">Rating</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{feedbacks &&
						feedbacks.map((f) => (
							<TableRow>
								<TableCell className="font-medium">
									{f.name}
								</TableCell>
								<TableCell>{f.email}</TableCell>
								<TableCell>{f.content}</TableCell>
								<TableCell>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												{format(
													f._creationTime,
													"do MMM yyyy",
													{
														locale: enUS,
													}
												)}
											</TooltipTrigger>
											<TooltipContent>
												<p>
													{format(
														f._creationTime,
														"do MMM yyyy, h:mm a",
														{
															locale: enUS,
														}
													)}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
								<TableCell className="flex items-center justify-end">
									{[...Array(5)].map((_, idx) => (
										<StarIcon
											key={idx}
											className={cn(
												"h-5 w-5 cursor-pointer",
												{
													"fill-primary":
														f.rating > idx,
													"fill-muted stroke-muted-foreground":
														f.rating <= idx,
												}
											)}
										/>
									))}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}

export default ProjectPage;
