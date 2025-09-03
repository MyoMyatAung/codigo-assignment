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
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { addPlayerToTeam, Player, Team } from "@/redux/teamSlice";
import { cn } from "@/lib/utils";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";

interface AddPlayerDrawer {
  children: React.ReactNode;
  team: string; // only team id
}

export function AddPlayerDrawer({ children, team }: AddPlayerDrawer) {
  const { ref, inView } = useInView();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { list } = useAppSelector((state: RootState) => state.team);
  const dispatch = useAppDispatch();
  const selectedTeam = list.find((t: Team) => t.id === team);
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["players"],
    queryFn: async ({
      pageParam,
    }): Promise<{
      data: Array<any>;
      previousId: number;
      nextId: number;
    }> => {
      const response = await fetch(
        `https://api.balldontlie.io/v1/players?per_page=10&cursor=${pageParam}`,
        { headers: { Authorization: "124602cd-84f3-4c6f-a1e5-5e21181f99f9" } }
      );
      return await response.json();
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage: any) => {
      return firstPage.meta.next_cursor - 20;
    },
    getNextPageParam: (lastPage: any) => {
      return lastPage.meta.next_cursor;
    },
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleAddPlayer = () => {
    if (!selectedPlayer || !selectedTeam) {
      console.warn("No player or team selected.");
      return;
    }

    // Check if the player is already on a team
    const isPlayerAlreadyAssigned = list.some((t) =>
      t.players.some((p) => p.id === selectedPlayer.id)
    );

    if (isPlayerAlreadyAssigned) {
      alert(
        `${selectedPlayer.first_name} ${selectedPlayer.last_name} is already on a team.`
      );
      return;
    }

    // Dispatch the Redux action to add the player to the team
    dispatch(
      addPlayerToTeam({ teamId: selectedTeam.id, player: selectedPlayer })
    );

    // Clear the selected player and close the drawer
    setSelectedPlayer(null);
  };

  const allPlayers = data?.pages.flatMap((page) => page.data) || [];

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Players</DrawerTitle>
            <DrawerDescription>
              Choose a player to add to your team
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-17">
            {status === "pending" ? (
              <p>Loading...</p>
            ) : status === "error" ? (
              <span>Error: {error.message}</span>
            ) : (
              <>
                {allPlayers
                  .filter(
                    (p: Player) =>
                      !selectedTeam?.players.some(
                        (plyr: Player) => plyr.id === p.id
                      )
                  )
                  .map((player) => (
                    <div
                      className={cn([
                        "border rounded-sm mb-1 p-2 cursor-pointer transition-all duration-150 ease-in-out",
                        selectedPlayer?.id === player.id
                          ? "border-2 border-white bg-gray-800"
                          : "hover:bg-gray-700",
                      ])}
                      key={player.id}
                      onClick={() => handleSelectPlayer(player)}
                    >
                      <h1 className="font-semibold text-lg">
                        {player.first_name} {player.last_name}
                      </h1>
                      <p className="text-sm text-gray-400">
                        {player.country} | {player.college}
                      </p>
                      <p className="text-sm text-gray-400">
                        Position: {player.position}
                      </p>
                    </div>
                  ))}
                <div>
                  <button
                    ref={ref}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    {isFetchingNextPage
                      ? "Loading more..."
                      : hasNextPage
                        ? "Load Newer"
                        : "Nothing more to load"}
                  </button>
                </div>
                <div>
                  {isFetching && !isFetchingNextPage
                    ? "Background Updating..."
                    : null}
                </div>
              </>
            )}
            <hr />
          </div>
          <DrawerFooter className="absolute bottom-0 border-t flex-row justify-start items-center bg-black w-full">
            <DrawerClose asChild>
              <Button
                className="cursor-pointer"
                onClick={handleAddPlayer}
                disabled={!selectedPlayer}
              >
                Add
              </Button>
            </DrawerClose>{" "}
            <DrawerClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
