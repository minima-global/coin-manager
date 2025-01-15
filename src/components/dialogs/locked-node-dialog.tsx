import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerPortal,
  DrawerOverlay,
} from "@/components/ui/drawer";

import { useMediaQuery } from "@/hooks/use-media-query";
import { LockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";

export function LockedNodeDialog() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  if (isDesktop) {
    return (
      <Dialog open={true}>
        <DialogPortal>
          <DialogContent
            className="bg-grey10 dark:bg-darkContrast sm:max-w-lg"
            showCloseButton={false}
          >
            <DialogHeader className="flex flex-col items-center">
              <LockIcon className="w-12 h-12 mb-4" />
              <DialogTitle className="text-center">Node Locked</DialogTitle>
              <DialogDescription className="text-center">
                Please unlock your node and return to this page to continue.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => navigate({ to: "/" })}>Return Home</Button>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  return (
    <Drawer open={true}>
      <DrawerPortal>
        <DrawerOverlay className="bg-background/50" />
        <DrawerContent className="bg-grey10 dark:bg-darkContrast h-2/5 p-4">
          <DrawerHeader>
            <DrawerTitle className="flex flex-col items-center">
              <LockIcon className="w-12 h-12 mb-4" />
              Node Locked
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Please unlock your node to access this page
            </DrawerDescription>
          </DrawerHeader>
          <Button onClick={() => navigate({ to: "/" })}>Return Home</Button>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
