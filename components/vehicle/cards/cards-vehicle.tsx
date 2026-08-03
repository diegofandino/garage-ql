'use client'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { deleteVehicleFromDB } from "@/app/actions";
import { Vehicle as VehicleSchemaPage } from "@/app/page";
import { useTransition } from "react";
import { showToast } from "@/app/helpers/show-toastr/show-toastr";
import MaintenanceLogsModal from "@/components/maintenance/logs/maintenance-logs-modal";
import { Button } from "@base-ui/react";

function getLatestRecord(records: VehicleSchemaPage['records']) {
    return records?.reduce((latest, record) =>
        !latest || new Date(record.date) > new Date(latest.date) ? record : latest
        , records[0]);
}


export const CardVehicleComponent = ({ id, nickname, make, model, year, plate, records }: Pick<VehicleSchemaPage, 'id' | 'nickname' | 'make' | 'model' | 'year' | 'plate' | 'records'>) => {
    const latestRecord = getLatestRecord(records);
    const [isPending, startTransition] = useTransition();

    const handleDeleteVehicle = (id: string) => {
        startTransition(async () => {
            const result = await deleteVehicleFromDB({ success: false, message: '' }, id);
            showToast({
                title: result.success ? 'Vehicle deleted successfully!' : 'Something went wrong.',
                description: result.message,
                type: result.success ? 'success' : 'error',
            });
        });
    }

    return (

        <Card className="w-full flex-shrink max-w-full min-h-auto md:max-w-[450px] md:min-h-[180px]">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle> {make} {model} {nickname} {year}</CardTitle>
                    <CardDescription>
                        Your mileage: {latestRecord?.mileage || 'No mileage'}
                    </CardDescription>
                </div>
                <div className="font-bold px-4 py-2 bg-orange-500 text-white rounded-sm text-gray-800 tracking-wide">
                    {plate}
                </div>
            </CardHeader>
            <CardFooter className="flex-row items-center gap-3 h-full justify-between">
                <div>
                    Last maintanance: <b>{latestRecord?.date || 'No Maintainance date'}</b>
                </div>
                <div className="flex flex-col gap-2">
                    <MaintenanceLogsModal nickname={nickname} records={records} />
                    <Button
                        onClick={() => handleDeleteVehicle(id)}
                        disabled={isPending}
                        className="bg-red-700 text-white hover:bg-red-900 px-2 py-1 rounded-md cursor-pointer disabled:opacity-50"
                    >
                        {isPending ? 'Deleting…' : 'Delete'}
                    </Button>
                </div>
            </CardFooter>
        </Card>

    )
}
