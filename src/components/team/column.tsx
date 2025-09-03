"use client";

import { Team } from "@/redux/teamSlice";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Edit, Minus, Plus, Trash } from "lucide-react";
import { EditTeamDialog } from "./edit-team-dialog";
import { TeamTooltip } from "./team-tooltip";
import { AddPlayerDrawer } from "./add-player-drawer";
import { RemovePlayerDrawer } from "./remove-player-drawer";
import { DeleteTeamDialog } from "./delete-team-dialog";

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue<string>("id");
      return <div className="truncate w-40">{id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Team Name",
  },
  {
    accessorKey: "playerCount",
    header: "Numbers of Players",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <TeamTooltip content={`Add a player to ${row.original.name}`}>
            <AddPlayerDrawer team={row.original.id}>
              <Button className="cursor-pointer" variant="ghost" size="sm">
                <Plus />
              </Button>
            </AddPlayerDrawer>
          </TeamTooltip>
          <TeamTooltip content={`Remove a player from ${row.original.name}`}>
            <RemovePlayerDrawer teamId={row.original.id}>
              <Button className="cursor-pointer" variant="ghost" size="sm">
                <Minus />
              </Button>
            </RemovePlayerDrawer>
          </TeamTooltip>
          <TeamTooltip content="Edit the team">
            <EditTeamDialog team={row.original}>
              <Button className="cursor-pointer" variant="ghost" size="sm">
                <Edit />
              </Button>
            </EditTeamDialog>
          </TeamTooltip>
          <TeamTooltip content="Delete the team">
            <DeleteTeamDialog team={row.original}>
              <Button className="cursor-pointer" variant="ghost" size="sm">
                <Trash className="text-red-400" />
              </Button>
            </DeleteTeamDialog>
          </TeamTooltip>
        </div>
      );
    },
  },
];
