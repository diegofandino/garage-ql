import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { Vehicle as BaseVehicle } from '@/lib/data'

export type Vehicle = BaseVehicle & {
    records: { id: string, mileage: string, date: string }[];
};

async function getVehicles() {
    const res = await fetch(`${process.env.BASE_API_URL}${process.env.GRAPH_QL_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                {
                    vehicles {
                        nickname
                        make
                        plate
                        model
                        year
                        records {
                            id
                            mileage
                            date
                        }
                    } 
                }           
            `
        })
    });

    console.log(res)

    if (!res.ok) return [];

    const { data } = await res.json();
    console.log('data', data);
    return data.vehicles as Vehicle[];
}

function getLatestRecord(records: Vehicle['records']) {
    return records?.reduce((latest, record) =>
        !latest || new Date(record.date) > new Date(latest.date) ? record : latest
        , records[0]);
}

const CardVehicleComponent = ({ key, nickname, make, model, year, plate, records }: Pick<Vehicle, 'nickname' | 'make' | 'model' | 'year' | 'plate' | 'records'> & {
    key: string
}) => {
    const latestRecord = getLatestRecord(records);

    return (

        <Card key={key} className="w-full max-w-[450px]">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle> {make} {model} {nickname} {year}</CardTitle>
                    <CardDescription>
                        Your mileage: {latestRecord?.mileage || 'No mileage'}
                    </CardDescription>
                </div>
                <div className="font-bold px-4 py-2 bg-yellow-300 rounded-sm text-gray-800 tracking-wide">
                    {plate}
                </div>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
                Last maintanance: <b>{latestRecord?.date || 'No Maintainance date'}</b>
            </CardFooter>
        </Card>

    )
}


export default async function VehicleTable() {

    const vehicles: Vehicle[] = await getVehicles();

    return (
        <section className="py-5">
            <h2 className="text-xl font-bold">Your Garage</h2>
            <p> Every vehicle keeps its own maintanance history below </p>
            <div className="my-4 flex flex-row gap-10 flex-wrap">
                {
                    vehicles.map(
                        vehicle => (
                            <CardVehicleComponent key={vehicle.id} records={vehicle.records} model={vehicle.model} nickname={vehicle.nickname} make={vehicle.make} year={vehicle.year} plate={vehicle.plate} />
                        )
                    )
                }
            </div>
        </section>
    );
}