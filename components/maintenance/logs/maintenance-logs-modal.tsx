'use client'

import { useActionState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogPopup,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogPopup,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogClose,
} from '@/components/ui/alert-dialog';
import { CreateGeneralMessage, deleteMaintenanceFromVehicle } from '@/app/actions';
import { showToast } from '@/app/helpers/show-toastr/show-toastr';

type MaintenanceLogRecord = {
    id: string;
    type: string;
    date: string;
    mileage: number | string;
    notes?: string | null;
};

type MaintenanceLogsModalProps = {
    nickname: string;
    records: MaintenanceLogRecord[];
};

const initialState: CreateGeneralMessage = {
    success: false,
    message: ''
}

export default function MaintenanceLogsModal({ nickname, records }: MaintenanceLogsModalProps) {

    const [_, startTransition] = useTransition();

    const [state, deleteLog, isPending] = useActionState(deleteMaintenanceFromVehicle, initialState);

    const deleteLogFromCar = async (id: string) => {
        startTransition(async () => {
            await deleteLog(id);
        })
    };

    useEffect(() => {
        if (!state.success && state.errors) {
            showToast({
                title: 'Something went wrong.',
                description: 'Please try again.',
                type: 'error',
            });
        }
        if (state.success === true) {
            showToast({
                title: 'Maintenance log deleted successfully!',
                description: state.message,
                type: 'success',
            });
        }
    }, [state])

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-3 cursor-pointer">
                        View logs
                    </Button>
                }
            />
            <DialogPopup>
                <DialogClose />
                <DialogTitle>{nickname} — history</DialogTitle>
                <DialogDescription>
                    You will find all maintenance logs here.
                </DialogDescription>

                <div className="mt-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                    {records.length === 0 && (
                        <p className="text-sm text-muted-foreground">No logs yet.</p>
                    )}
                    {[...records]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 "
                            >
                                <div className="min-w-0">
                                    <p className="font-medium">{record.type}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {record.date} - {record.mileage} km
                                    </p>
                                    {record.notes && (
                                        <p className="mt-1 text-sm text-muted-foreground">{record.notes}</p>
                                    )}
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger
                                        render={
                                            <Button variant="destructive" size="sm" className="cursor-pointer" >
                                                Delete
                                            </Button>
                                        }
                                    />
                                    <AlertDialogPopup>
                                        <AlertDialogTitle>Delete this log?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This removes the {record.type} record from {record.date}. This can not be undone.
                                        </AlertDialogDescription>
                                        <div className="mt-5 flex justify-end gap-2">
                                            <AlertDialogClose render={<Button variant="outline" size="sm" />}>
                                                Cancel
                                            </AlertDialogClose>
                                            <AlertDialogClose
                                                render={
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteLogFromCar(record.id)}
                                                    />
                                                }
                                            >
                                                {isPending ? 'Deleting...' : 'Delete'}
                                            </AlertDialogClose>
                                        </div>
                                    </AlertDialogPopup>
                                </AlertDialog>
                            </div>
                        ))}
                </div>
            </DialogPopup>
        </Dialog>
    );
}
