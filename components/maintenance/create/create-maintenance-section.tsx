import type { Vehicle } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type CreateMaintenanceSectionProps = {
  vehicles: Vehicle[];
};

const maintenanceTypes = [
  'Oil Change',
  'Tire Rotation',
  'Brake Pads',
  'Battery',
  'Other',
];

export default function CreateMaintenanceSection({
  vehicles,
}: CreateMaintenanceSectionProps) {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-16 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Log maintenance</h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Attach a service record to any vehicle in your garage — oil changes,
          tire rotations, repairs, and more.
        </p>
      </div>

      <Card className="border border-border bg-card">
        <CardContent>
          {/* Practice step 1: connect this form to your create-maintenance action. */}
          <form className="flex flex-col gap-5">
            <div>
              <Label htmlFor="vehicle" className="mb-2 block">
                Vehicle
              </Label>
              <select
                id="vehicle"
                name="vehicleId"
                defaultValue=""
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  Select a vehicle
                </option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.plate}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="type" className="mb-2 block">
                  Service type
                </Label>
                <select
                  id="type"
                  name="type"
                  defaultValue=""
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  {maintenanceTypes.map((maintenanceType) => (
                    <option key={maintenanceType} value={maintenanceType}>
                      {maintenanceType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="date" className="mb-2 block">
                  Date
                </Label>
                <Input id="date" name="date" type="date" />
              </div>
            </div>

            <div>
              <Label htmlFor="mileage" className="mb-2 block">
                Mileage at service
              </Label>
              <Input id="mileage" name="mileage" type="number" placeholder="e.g. 68,400" />
            </div>

            <div>
              <Label htmlFor="notes" className="mb-2 block">
                Notes
              </Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Anything worth remembering — parts used, shop name, next steps..."
                className="w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            {/* Practice step 2: add pending, validation, and success feedback here. */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                Save record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
