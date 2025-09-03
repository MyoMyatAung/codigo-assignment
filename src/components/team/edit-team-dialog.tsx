// src/components/team/EditTeamDialog.tsx

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTeam, Team } from "@/redux/teamSlice"; // Adjust path as needed
import { RootState, useAppSelector } from "@/redux/store"; // Import useAppSelector and RootState

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditTeamDialogProps {
  children: React.ReactNode;
  team: Team;
}

export function EditTeamDialog({ children, team }: EditTeamDialogProps) {
  const dispatch = useDispatch();
  const { list } = useAppSelector((state: RootState) => state.team); // Get the list of all teams
  const [open, setOpen] = useState(false);
  const [editedTeam, setEditedTeam] = useState<Team>(team);
  const [error, setError] = useState<string | null>(null); // State for the error message

  useEffect(() => {
    setEditedTeam(team);
  }, [team]);
  
  const regions = ["Americas", "Europe", "Asia", "Africa", "Oceania"];
  const countries = ["USA", "UK", "Canada", "Germany", "Japan", "Brazil"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTeam({ ...editedTeam, [name]: value });
  };

  const handleSelectChange = (value: string, name: keyof Team) => {
    setEditedTeam({ ...editedTeam, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    // Check if the new name is a duplicate of any other team's name
    const isNameTakenByAnotherTeam = list.some(
      (t) => t.id !== editedTeam.id && t.name === editedTeam.name.trim()
    );

    if (isNameTakenByAnotherTeam) {
      setError("Team with this name already exists.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Dispatch the updateTeam action
    dispatch(updateTeam(editedTeam));
    
    // Close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {team.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          {/* ... other form fields (name, playerCount, etc.) ... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedTeam.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playerCount" className="text-right">
              Player Count
            </Label>
            <Input
              id="playerCount"
              name="playerCount"
              type="number"
              value={editedTeam.playerCount}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Region
            </Label>
            <Select 
              onValueChange={(value) => handleSelectChange(value, 'region')}
              value={editedTeam.region}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Select 
              onValueChange={(value) => handleSelectChange(value, 'country')}
              value={editedTeam.country}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit">
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}