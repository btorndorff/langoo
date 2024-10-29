import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DialogueModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>Start a Dialogue</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-semibold mb-4">Start a Dialogue</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter a name for your new dialogue.
        </p>
        <Input placeholder="Dialogue name" className="mb-4" />
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
