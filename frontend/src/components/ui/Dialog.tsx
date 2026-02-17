import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    }, [isOpen]);

    // Handle clicking backdrop to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialog = dialogRef.current;
        if (dialog && e.target === dialog) {
            onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className={cn(
                "backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm",
                "bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg m-auto",
                "fixed inset-0 z-50",
                "open:animate-in open:fade-in-0 open:zoom-in-95",
                "closed:animate-out closed:fade-out-0 closed:zoom-out-95",
                className
            )}
            onClick={handleBackdropClick}
            onCancel={onClose}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-display font-bold text-slate-900">{title}</h2>
                        {description && (
                            <p className="text-sm text-slate-500 mt-1">{description}</p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 text-slate-500"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                {children}
            </div>
        </dialog>
    );
}
