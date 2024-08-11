"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValid, z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	url: z.string().url(),
});

function NewProjectButton() {
	const createProject = useMutation(api.projects.createProject);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			url: "",
		},
	});

	const {
		reset,
		formState: { isSubmitting, isDirty, isValid },
	} = form;

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		const projectId = await createProject(values);
		console.log(`New project created with ${projectId}`);
		reset();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex items-center justify-center gap-2">
					<PlusIcon className="h-4 w-4" />
					Create Project
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>New Project</DialogTitle>
					<DialogDescription>
						Create a new project to get started
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Project Name"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is your project name.
									</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<FormControl>
										<Input
											placeholder="https://www.example.com"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is your project domain.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="submit"
								disabled={!isDirty || !isValid || isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Project"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default NewProjectButton;
