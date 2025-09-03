import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTeam, Team } from "@/redux/teamSlice"; // Adjust the path as needed
import { RootState, useAppSelector } from "@/redux/store"; // Import useAppSelector and RootState
import { v4 as uuid4 } from "uuid";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CreateTeamDialogProps {
  children: React.ReactNode;
}

export function CreateTeamDialog({ children }: CreateTeamDialogProps) {
  const dispatch = useDispatch();
  const { list } = useAppSelector((state: RootState) => state.team); // Get the list of all teams
  const [open, setOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<
    Omit<Team, "id" | "playerCount" | "players">
  >({
    name: "",
    region: "",
    country: "",
  });
  const [error, setError] = useState<string | null>(null); // State for the error message

  const regions = ["Americas", "Europe", "Asia", "Africa", "Oceania"];
  const countries = ["USA", "UK", "Canada", "Germany", "Japan", "Brazil"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleSelectChange = (
    value: string,
    name: keyof Omit<Team, "id" | "playerCount" | "players">
  ) => {
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    // Validation check: ensure the name is not empty
    if (!newTeam.name.trim()) {
      setError("Team name cannot be empty.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Check if a team with this name already exists
    const isNameTaken = list.some((team) => team.name === newTeam.name.trim());
    if (isNameTaken) {
      setError("Team with this name already exists.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Dispatch the addTeam action
    dispatch(addTeam({ ...newTeam, playerCount: 0, id: uuid4(), players: [] }));

    // Close the dialog and reset the form
    setOpen(false);
    setNewTeam({
      name: "",
      region: "",
      country: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={newTeam.name}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          {/* ... other form fields (region, country) ... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Region
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "region")}
              value={newTeam.region}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "country")}
              value={newTeam.country}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
