import { columns } from "@/components/team/column";
import { CreateTeamDialog } from "@/components/team/create-team-dialog";
import { DataTable } from "@/components/team/data-table";
import { Button } from "@/components/ui/button";
import { RootState, useAppSelector } from "@/redux/store";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: App,
});

function App() {
  const { list } = useAppSelector((state: RootState) => state.team);
  return (
    <div>
      <div className="flex items-center justify-end">
        <CreateTeamDialog>
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create a team
          </Button>
        </CreateTeamDialog>
      </div>
      <div className="container mx-auto my-2">
        <DataTable columns={columns} data={list} />
      </div>
    </div>
  );
}
