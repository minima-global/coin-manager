import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  ConsolidationContent,
  ManualConsolidationContent,
} from "./consolidation-content"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ConsolidationDialogProps {
  disabled?: boolean
}

export function ConsolidationDialog({ disabled }: ConsolidationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild disabled={disabled}>
          <Button variant="outline">Consolidate</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Consolidate</DialogTitle>
            <DialogDescription>
              Consolidate your coins automatically
            </DialogDescription>
          </DialogHeader>
          <ConsolidationContent />
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild disabled={disabled}>
        <Button variant="outline">Consolidate</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Consolidate</DrawerTitle>
          <DrawerDescription>
            Consolidate your coins automatically
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <ConsolidationContent />
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface ManualConsolidationDialogProps {
  coinIds: string[]
  onConsolidate?: () => void
}

export function ManualConsolidationDialog({
  coinIds,
  onConsolidate,
}: ManualConsolidationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Consolidate
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manual Consolidate</DialogTitle>
            <DialogDescription>
              Consolidate {coinIds.length} selected coins
            </DialogDescription>
          </DialogHeader>
          <ManualConsolidationContent
            coinIds={coinIds}
            onConsolidate={() => {
              onConsolidate?.()
            }}
          />
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onConsolidate?.()
              }}
            >
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Consolidate</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Manual Consolidate</DrawerTitle>
          <DrawerDescription>
            Consolidate {coinIds.length} selected coins
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <ManualConsolidationContent coinIds={coinIds} />
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onConsolidate?.()
              }}
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
