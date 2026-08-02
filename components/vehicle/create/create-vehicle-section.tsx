'use client'
import { createVehicle, type CreateVehicleMessage } from '@/app/actions';
import { showToast } from '@/app/helpers/show-toastr/show-toastr';
import { FieldError } from '@/components/shared/errors-inputs/errors-inputs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@base-ui/react';
import { useActionState, useEffect } from 'react';

const initialValue: CreateVehicleMessage = {
    success: false,
    message: ''
}

export default function CreateVehicleSection() {

    const [state, formAction, isPending] = useActionState(createVehicle, initialValue);

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
        }
    }, [state]);

    return (<div className="mx-auto grid grid-cols-1 gap-8 py-16 md:grid-cols-[1fr_1.4fr]">
        <div>
            <h1 className="text-2xl font-semibold">Add a vehicle</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Register a car, truck, or bike to your garage. Once it&apos;s
                in, you can start logging every service against it.
            </p>
        </div>

        <Card>
            <CardContent>
                <form action={formAction} className="flex flex-col gap-5">
                    <div>
                        <Label htmlFor="nickname" className="mb-2 block">
                            Nickname
                        </Label>
                        <Input id="nickname" name="nickname" placeholder="e.g. The Beast" />
                        <FieldError errors={state.errors?.nickname} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="make" className="mb-2 block">
                                Make
                            </Label>
                            <Input id="make" name="make" placeholder="e.g. Subaru" />
                            <FieldError errors={state.errors?.make} />
                        </div>
                        <div>
                            <Label htmlFor="model" className="mb-2 block">
                                Model
                            </Label>
                            <Input id="model" name="model" placeholder="e.g. Outback" />
                            <FieldError errors={state.errors?.model} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="year" className="mb-2 block">
                                Year
                            </Label>
                            <Input id="year" name="year" type="number" placeholder="2022" />
                            <FieldError errors={state.errors?.year} />
                        </div>
                        <div>
                            <Label htmlFor="plate" className="mb-2 block">
                                License plate
                            </Label>
                            <Input style={{ textTransform: "uppercase" }} id="plate" name="plate" placeholder="ABC 1234" />
                            <FieldError errors={state.errors?.plate} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-orange-500 px-4 py-2 rounded-sm text-white hover:bg-orange-600"
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