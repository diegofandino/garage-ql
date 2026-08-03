'use client'
import { createVehicle, type CreateGeneralMessage } from '@/app/actions';
import { showToast } from '@/app/helpers/show-toastr/show-toastr';
import { FieldError } from '@/components/shared/errors-inputs/errors-inputs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@base-ui/react';
import { useActionState, useEffect, useState } from 'react';

const initialValue: CreateGeneralMessage = {
    success: false,
    message: ''
}

const emptyForm = {
    nickname: '',
    make: '',
    model: '',
    year: '',
    plate: '',
};

type VehicleFormValues = typeof emptyForm;

export default function CreateVehicleSection() {

    const [state, formAction, isPending] = useActionState(createVehicle, initialValue);

    const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
    const markDirty = (field: string) =>
        setDirtyFields((prev) => new Set(prev).add(field));
    const errorFor = (field: string) =>
        dirtyFields.has(field) ? undefined : state.errors?.[field];

    const [formValues, setFormValues] = useState<VehicleFormValues>(emptyForm);
    const updateField = (field: keyof VehicleFormValues) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            markDirty(field);
            setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
        };

    useEffect(() => {
        if (state.success === false && state.errors) {
            showToast({
                title: 'Check fields',
                description: 'Please, use the correct data',
                type: 'error',
            });
        }

        if (state.success === true) {
            showToast({
                title: 'Vehicle saved!',
                description: state.message,
                type: 'success',
            });
            setFormValues(emptyForm);
        }
    }, [state]);

    return (<div className="mx-auto max-w-5xl grid grid-cols-1 gap-15 py-16 md:grid-cols-[1fr_1.5fr]">
        <div>
            <h1 className="text-2xl font-semibold">Add a vehicle</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Register a car, truck, or bike to your garage. Once it&apos;s
                in, you can start logging every service against it.
            </p>
        </div>

        <Card>
            <CardContent>
                <form action={formAction} onSubmit={() => setDirtyFields(new Set())} className="flex flex-col gap-5">
                    <div>
                        <Label htmlFor="nickname" className="mb-2 block">
                            Nickname
                        </Label>
                        <Input id="nickname" name="nickname" placeholder="e.g. The Beast" value={formValues.nickname} onChange={updateField('nickname')} />
                        <FieldError errors={errorFor('nickname')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="make" className="mb-2 block">
                                Make
                            </Label>
                            <Input id="make" name="make" placeholder="e.g. Subaru" value={formValues.make} onChange={updateField('make')} />
                            <FieldError errors={errorFor('make')} />
                        </div>
                        <div>
                            <Label htmlFor="model" className="mb-2 block">
                                Model
                            </Label>
                            <Input id="model" name="model" placeholder="e.g. Outback" value={formValues.model} onChange={updateField('model')} />
                            <FieldError errors={errorFor('model')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="year" className="mb-2 block">
                                Year
                            </Label>
                            <Input id="year" name="year" type="number" placeholder="2022" value={formValues.year} onChange={updateField('year')} />
                            <FieldError errors={errorFor('year')} />
                        </div>
                        <div>
                            <Label htmlFor="plate" className="mb-2 block">
                                License plate
                            </Label>
                            <Input style={{ textTransform: "uppercase" }} id="plate" name="plate" placeholder="ABC 1234" value={formValues.plate} onChange={updateField('plate')} />
                            <FieldError errors={errorFor('plate')} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-orange-500 px-4 py-2 rounded-sm text-white hover:bg-orange-600 cursor-pointer"
                        >
                            {isPending ? 'Saving…' : 'Save vehicle'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
    )
}
