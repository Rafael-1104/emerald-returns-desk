import { Link, useRouterState } from "@tanstack/react-router";
import { navGroups } from "./Sidebar";
import { cn } from "@/lib/utils";

const items = navGroups.flatMap((g) => g.items);

/** Navegação compacta para telas menores (o desktop usa a sidebar fixa). */
export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="sticky top-16 z-10 flex gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
