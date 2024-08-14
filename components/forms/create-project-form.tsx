"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	url: z.string().url(),
});

function CreateProjectForm({ setOpen }: { setOpen: any }) {
	const router = useRouter();
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
		formState: { isSubmitting },
	} = form;

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		const projectId = await createProject(values);
		console.log(`New project created with ${projectId}`);
		reset();
		setOpen(false);
		router.push(`/projects/${projectId}/instructions`);
		toast.success("Project created successfully!");
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Project Name" {...field} />
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
				<div className="justify-end w-full flex">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<Loader2 className="animate-spin h-4 w-4" />
						) : (
							<span>Create</span>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

export default CreateProjectForm;
