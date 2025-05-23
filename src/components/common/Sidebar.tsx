import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { cn, showDialog } from "@/lib/utils";
import { useGetDepartmentList } from "@/modules/Departments/api/queryGetDepartmentList";
import DepartmentForm from "@/modules/Departments/components/DepartmentForm";
import { TDepartment } from "@/types/departments";
import { Building2, LogOut, PanelLeftClose, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  action?: () => void;
};

const Sidebar = ({ setIsSidebarOpen }: Props) => {
  const currentPath = useLocation().pathname;
  const { authState, logout } = useAuth();
  const { checkFeatureAvailability } = useAuthorize();

  const { roleNavItems } = useAuthorize();

  const SIDEBAR_ITEMS: SidebarItem[][] = [
    [...(roleNavItems || [])],
    [
      {
        icon: <User size={20} />,
        label: "Account Settings",
        href: PrivatePageEndPoints.accountSettings.path,
      },
      {
        icon: <LogOut size={20} />,
        label: "Logout",
        href: "",
        action: logout,
      },
    ],
  ];

  const isActive = (path: string) => {
    return path !== "" && currentPath.includes(path);
  };

  const getDepartmentList = useGetDepartmentList({
    params: {
      userId: authState.userData?.id,
    },
    queryConfig: {
      retry: false,
    },
  });

  function handleCreateDepartment() {
    showDialog({
      title: "Create Department",
      children: <DepartmentForm />,
    });
  }

  return (
    <nav className="border-border-weak flex h-screen w-[var(--sidebar-width)] flex-col justify-between border-r bg-white lg:border-0">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <Link to={PrivatePageEndPoints.root.path}>
            <h1 className="text-lg font-semibold lg:text-xl">IdeaHub</h1>
          </Link>
          <PanelLeftClose
            size={20}
            className="cursor-pointer lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-y-1 p-2">
          <p className="text-brand px-2 py-1.5 text-sm">Departments</p>
          {getDepartmentList.isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full" />
              ))}
            </>
          ) : (
            getDepartmentList.data?.data.body.map((department: TDepartment) => (
              <Link
                key={department.id}
                to={`${PrivatePageEndPoints.departments.details.root.path.replace(
                  ":id",
                  department.id,
                )}`}
                className={cn(
                  "hover:bg-surface-weak group grid cursor-pointer items-center justify-between gap-x-2.5 rounded-md px-2 py-1.5 transition-colors",
                  isActive(
                    `${PrivatePageEndPoints.departments.details.root.path.replace(
                      ":id",
                      department.id,
                    )}`,
                  ) && "bg-surface-weak",
                )}
              >
                <div className="grid grid-cols-[20px_1fr] items-center gap-x-2.5">
                  <Building2 size={20} />
                  <p className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                    {department.name}
                  </p>
                </div>
              </Link>
            ))
          )}
          {checkFeatureAvailability(FEATURES.ACADEMIC_YEAR_SETTING) && (
            <Button
              variant="ghost"
              className="justify-start gap-x-2.5 px-2 text-base font-normal"
              onClick={handleCreateDepartment}
            >
              <Plus size={20} className="text-brand" />
              <p className="text-brand">Create New</p>
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-y-1 p-2">
          {SIDEBAR_ITEMS[0].map((item) => (
            <Link key={item.label} to={item.href}>
              <div
                className={cn(
                  "hover:bg-surface-weak flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors",
                  isActive(item.href) && "bg-surface-weak",
                )}
              >
                {item.icon}
                <p className="text-black">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-border-weak border-t px-2 py-3">
        {SIDEBAR_ITEMS[1].map((item) => {
          const menuItem = (
            <div
              className={cn(
                "hover:bg-surface-weak flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors",
                isActive(item.href) && "bg-surface-weak",
              )}
            >
              {item.icon}
              <p className="text-black">{item.label}</p>
            </div>
          );

          return item.href ? (
            <Link to={item.href} key={item.label}>
              {menuItem}
            </Link>
          ) : (
            <div key={item.label} onClick={item.action}>
              {menuItem}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
