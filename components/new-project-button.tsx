"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateProjectForm from "@/components/forms/create-project-form";
import { ResponsiveDialog } from "./responsive-dialog";

function NewProjectButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				className="flex items-center justify-center gap-2"
				onClick={() => setIsOpen(true)}
			>
				<PlusIcon className="h-4 w-4" />
				Create Project
			</Button>

			<ResponsiveDialog
				open={isOpen}
				setOpen={setIsOpen}
				header="Create a new Project"
			>
				<CreateProjectForm setOpen={setIsOpen} />
			</ResponsiveDialog>
		</>
	);
}

export default NewProjectButton;
