import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { cn } from "cn";

interface PageHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    children?: ReactNode
}

export function Header({ className, children }: PageHeaderProps) {

    return (
        <header
            className={cn(
                "flex z-50  fixed px-6 py-4 top-0 pt-[calc(env(safe-area-inset-top)+8px)]  w-full bg-background left-0 items-center justify-between gap-4 pb-2",
                className
            )}>
            {children}
        </header>
    );
}


/**
 * 
 * 
 * 
 * 
 *  <div className="flex justify-between items-center w-full sm:w-auto">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold leading-none">
                            {user?.name ?? "Field Agent"}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs font-medium pt-1">
                            <p>Admin |</p>
                            {isOnline ? (
                                <>
                                    <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Online</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-3.5 w-3.5 text-destructive" />
                                    <span className="text-destructive">Offline</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
                        <Bell className="h-4 w-4" />
                    </Button>
                </div>
            </div>
 */