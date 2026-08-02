import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CreateVehicleSection from "@/components/vehicle/create/create-vehicle-section";
import CreateMaintenanceSection from "@/components/maintenance/create/create-maintenance-section";
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
                        id
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
    }),
    next: { tags: ['get-cars'] }
  });


  if (!res.ok) return [];

  const { data } = await res.json();
  return data.vehicles as Vehicle[];
}

function getLatestRecord(records: Vehicle['records']) {
  return records?.reduce((latest, record) =>
    !latest || new Date(record.date) > new Date(latest.date) ? record : latest
    , records[0]);
}

const CardVehicleComponent = ({ nickname, make, model, year, plate, records }: Pick<Vehicle, 'nickname' | 'make' | 'model' | 'year' | 'plate' | 'records'>) => {
  const latestRecord = getLatestRecord(records);

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
      <CardFooter className="flex-col gap-2 h-full justify-center">
        Last maintanance: <b>{latestRecord?.date || 'No Maintainance date'}</b>
      </CardFooter>
    </Card>

  )
}


export default async function VehicleTable() {

  const vehicles: Vehicle[] = await getVehicles();

  return (
    <div className="w-full">
      <section
        id="vehicles"
        className="relative isolate w-full overflow-hidden border-y border-border bg-[#17110d] px-6 py-20"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(23,17,13,0.50)_0%,rgba(23,17,13,0.30)_55%,rgba(23,17,13,0.40)_100%),url('/assets/garage-vehicles.png')] bg-cover bg-center opacity-60" />
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold">Your Garage</h2>
          <p> Every vehicle keeps its own maintanance history below </p>
          <div className="my-8 flex flex-row flex-wrap gap-5 lg:gap-10">
            {
              vehicles && vehicles.length > 0 ? vehicles.map(
                vehicle => (
                  <CardVehicleComponent key={vehicle.id} records={vehicle.records} model={vehicle.model} nickname={vehicle.nickname} make={vehicle.make} year={vehicle.year} plate={vehicle.plate} />
                )
              ) : (
                <h3 className="text-center mx-auto w-full text-4xl py-10"> There are not vehicles in your garage. </h3>
              )
            }
          </div>
        </div>
      </section>
      <section
        id="add-vehicle"
        className="relative isolate overflow-hidden border-b border-border bg-[#0d0906] px-6 py-20"
      >
        <div className="absolute inset-0 -z-10 scale-x-[-1] bg-[linear-gradient(90deg,rgba(13,9,6,0.30)_0%,rgba(13,9,6,0.65)_62%,rgba(13,9,6,0.60)_100%),url('/assets/add-vehicle-garage.png')] bg-cover bg-center" />

        <CreateVehicleSection />
      </section>
      <section
        id="maintenance"
        className="relative isolate w-full overflow-hidden border-y border-slate-700 bg-[#100b08] px-6 py-20"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,11,8,0.30)_0%,rgba(16,11,8,0.45)_42%,rgba(16,11,8,0.30)_100%),url('/assets/maintenance-notes.png')] bg-cover bg-center opacity-50" />
        <CreateMaintenanceSection vehicles={vehicles} />
      </section>
    </div>
  );
}
