
import React from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Camera } from "lucide-react";

interface CameraPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestPermission: () => void;
}

const CameraPermissionDialog: React.FC<CameraPermissionDialogProps> = ({
  open,
  onOpenChange,
  onRequestPermission
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" /> Camera Access Required
          </AlertDialogTitle>
          <AlertDialogDescription>
            Trash Sight Sentinel needs access to your camera to detect waste items.
            Please allow camera access when prompted by your browser.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onRequestPermission}>
            Allow Camera Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CameraPermissionDialog;
