import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface AppSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function AppSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
}: AppSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="w-full max-w-full sm:max-w-lg data-[side=right]:w-full overflow-y-auto px-4 pb-12 pt-[calc(env(safe-area-inset-top)+8px)] "
        showCloseButton={false}
      >
        {(title || description) && (
          <SheetHeader className="mb-4 px-0">
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  );
}