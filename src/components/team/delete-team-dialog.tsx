// src/components/team/DeleteTeamDialog.tsx

import React from "react";
import { useDispatch } from "react-redux";
import { deleteTeam, Team } from "@/redux/teamSlice"; // Adjust path as needed

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteTeamDialogProps {
  children: React.ReactNode;
  team: Team;
}

export function DeleteTeamDialog({ children, team }: DeleteTeamDialogProps) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    // Dispatch the deleteTeam action with the team's ID
    dispatch(deleteTeam(team.id));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the team{" "}
            <span className="font-semibold text-white">"{team.name}"</span> and
            remove all associated data from the list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}