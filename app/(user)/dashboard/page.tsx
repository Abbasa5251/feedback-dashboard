"use client";
import NewProjectButton from "@/components/new-project-button";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import React from "react";
import { Doc } from "@/convex/_generated/dataModel";

function DashboardPage() {
	const projects = useQuery(api.projects.getProjects);

	return (
		<div>
			<div className="flex items-center justify-center gap-3">
				<h1 className="text-3xl font-bold text-center my-4">
					Your Projects
				</h1>
				<NewProjectButton />
			</div>
			<div>
				<ul className="grid grid-cols-1 md:grid-cols-3 m-5 p-4 gap-4">
					{projects &&
						projects.map((project: Doc<"projects">) => (
							<li key={project._id}>
								<Card className="max-w-[350px] flex flex-col h-full">
									<CardHeader className="flex-1">
										<CardTitle>{project.name}</CardTitle>
									</CardHeader>
									<CardFooter>
										<Link href={`/projects/${project._id}`}>
											<Button>View Project</Button>
										</Link>
									</CardFooter>
								</Card>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
}

export default DashboardPage;
