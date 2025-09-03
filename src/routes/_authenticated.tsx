import { useAuth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  createFileRoute,
  redirect,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    console.log("context", context);
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      auth.logout();
      navigate({ to: "/login"  });
    };
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center gap-1">
              <SidebarTrigger />
              <h1>Welcome Back {auth.user?.username}</h1>
            </div>
            <div className="flex items-center gap-1">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-2">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    );
  },
});
