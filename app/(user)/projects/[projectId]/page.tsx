"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

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
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Message</TableHead>
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
