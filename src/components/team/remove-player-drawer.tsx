// src/components/team/RemovePlayerDrawer.tsx

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Player, Team, removePlayerFromTeam } from "@/redux/teamSlice"; // Import the new action
import { cn } from "@/lib/utils";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Trash } from "lucide-react";

interface RemovePlayerDrawerProps {
  children: React.ReactNode;
  teamId: string; // We only need the team's ID
}

export function RemovePlayerDrawer({ children, teamId }: RemovePlayerDrawerProps) {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state: RootState) => state.team);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Find the selected team by ID
  const selectedTeam = list.find((t: Team) => t.id === teamId);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleRemovePlayer = () => {
    if (!selectedPlayer || !selectedTeam) {
      return;
    }
    // Dispatch the Redux action to remove the player
    dispatch(removePlayerFromTeam({ teamId: selectedTeam.id, playerId: selectedPlayer.id }));
    // Clear the selected player and close the drawer
    setSelectedPlayer(null);
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Remove a Player</DrawerTitle>
            <DrawerDescription>
              Choose a player to remove from {selectedTeam?.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-17">
            {selectedTeam?.players && selectedTeam.players.length > 0 ? (
                selectedTeam.players.map((player) => (
                    <div
                        className={cn([
                            "border rounded-sm mb-1 p-2 cursor-pointer transition-all duration-150 ease-in-out",
                            selectedPlayer?.id === player.id
                                ? "border-2 border-red-500"
                                : "hover:bg-gray-700",
                        ])}
                        key={player.id}
                        onClick={() => handleSelectPlayer(player)}
                    >
                        <h1 className="font-semibold text-lg">
                            {player.first_name} {player.last_name}
                        </h1>
                        <p className="text-sm text-gray-400">
                            Position: {player.position}
                        </p>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-400 p-4">
                    This team has no players.
                </div>
            )}
          </div>
          <DrawerFooter className="absolute bottom-0 border-t flex-row justify-end items-center bg-background/95 backdrop-blur-sm w-full">
            <DrawerClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                className="cursor-pointer"
                onClick={handleRemovePlayer}
                disabled={!selectedPlayer} // Disable button if no player is selected
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}