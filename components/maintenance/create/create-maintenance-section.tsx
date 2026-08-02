'use client'
import type { Vehicle } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { CreateGeneralMessage, createLogMaintanceById } from '@/app/actions';
import { maintenanceTypes } from '../types/maintanance-types';
import { FieldError } from '@/components/shared/errors-inputs/errors-inputs';
import { showToast } from '@/app/helpers/show-toastr/show-toastr';

type CreateMaintenanceSectionProps = {
  vehicles: Vehicle[];
};

const initialValue: CreateGeneralMessage = {
  success: false,
  message: ''
}


export default function CreateMaintenanceSection({
  vehicles,
}: CreateMaintenanceSectionProps) {

  const [state, formAction, isPending] = useActionState(createLogMaintanceById, initialValue);
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  const markDirty = (field: string) =>
    setDirtyFields((prev) => new Set(prev).add(field));
  const errorFor = (field: string) =>
    dirtyFields.has(field) ? undefined : state.errors?.[field];


  useEffect(() => {
    setDirtyFields(new Set());
  }, [state]);

  useEffect(() => {
    if (!state.success && state.errors) {
      showToast({
        title: 'Check fields',
        description: 'Please, use the correct data',
        type: 'error',
      });
    }
    if (state.success === true) {
      showToast({
        title: 'Maintenance log saved!',
        description: state.message,
        type: 'success',
      });
    }
  }, [state])


  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-15 py-16 md:grid-cols-[1.5fr_1fr]">

      <Card className="border border-border bg-card">
        <CardContent>
          <form action={formAction} className="flex flex-col gap-5">
            <div>
              <Label htmlFor="vehicle" className="mb-2 block">
                Vehicle
              </Label>
              <select
                id="vehicle"
                name="vehicleId"
                defaultValue=""
                onChange={() => markDirty('vehicleId')}
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
              <FieldError errors={errorFor('vehicleId')} />
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
                  onChange={() => markDirty('type')}
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
                <FieldError errors={errorFor('type')} />
              </div>

              <div>
                <Label htmlFor="date" className="mb-2 block">
                  Date
                </Label>
                <Input id="date" name="date" type="date" onChange={() => markDirty('date')} />
                <FieldError errors={errorFor('date')} />
              </div>
            </div>

            <div>
              <Label htmlFor="mileage" className="mb-2 block">
                Mileage at service
              </Label>
              <Input id="mileage" name="mileage" type="number" placeholder="e.g. 68,400" onChange={() => markDirty('mileage')} />
              <FieldError errors={errorFor('mileage')} />
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
                onChange={() => markDirty('notes')}
                className="w-full resize-none min-h-[100px] rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <FieldError errors={errorFor('notes')} />
            </div>

            <div className="flex justify-end">
              <Button disabled={isPending} type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                {isPending ? 'Saving...' : 'Save record'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-heading text-2xl font-semibold">Log maintenance</h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Attach a service record to any vehicle in your garage — oil changes,
          tire rotations, repairs, and more.
        </p>
      </div>

    </section>
  );
}
