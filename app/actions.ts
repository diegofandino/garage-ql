'use server';
import { updateTag } from "next/cache";
import z from "zod";
import { getGraphQLUrl } from "@/lib/api-url";

export interface CreateGeneralMessage {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

const CreateVehicleSchema = z.object({
    nickname: z.string().min(3).max(50),
    make: z.string().min(2).max(50),
    model: z.string().min(1).max(100),
    year: z.string().regex(/^\d{4}$/, { message: 'Only year.' }),
    plate: z.string().toUpperCase().regex(/^[A-Z]{3}[0-9]{3}$/, { message: 'Plate should be: ABC123' })
});

const MaintenanceEnum = z.enum(["Oil Change", "Tire Rotation", "Brake Pads", "Battery", "Other"]);

const CreateLogMaintenanceForVehicle = z.object({
    vehicleId: z.string().min(1),
    type: MaintenanceEnum,
    date: z.string(),
    mileage: z.coerce.number().int().min(1),
    notes: z.string().optional()
});

export async function createVehicle(_prevState: CreateGeneralMessage, formData: FormData): Promise<CreateGeneralMessage> {
    const raw = Object.fromEntries(formData);
    const result = CreateVehicleSchema.safeParse(raw);

    if (!result.success) {
        return {
            success: false,
            message: 'Please fix the errors below.',
            errors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
        }
    }

    const objectToSend = {
        nickname: result.data.nickname,
        make: result.data.make,
        model: result.data.model,
        year: Number(result.data.year),
        plate: result.data.plate,
    }

    const response = await fetch(getGraphQLUrl(), {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            query: `
                mutation createNewVehicle($nickname: String!, $make: String!, $model: String!, $year: Int!, $plate: String!) {
                    createVehicle(nickname: $nickname, make: $make, model: $model, year: $year, plate: $plate) {
                        id
                    }
                }
            `,
            variables: objectToSend,
        }),
    })

    if (!response.ok) {
        return { success: false, message: 'Something went wrong saving the vehicle.' };
    }

    updateTag('get-cars');
    return { success: true, message: 'Vehicle saved.' };
}

export async function createLogMaintanceById(_prevState: CreateGeneralMessage, formData: FormData): Promise<CreateGeneralMessage> {
    const rawData = Object.fromEntries(formData);
    const result = CreateLogMaintenanceForVehicle.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            message: 'Please fix the errors below.',
            errors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
        }
    }

    const objectToSend = {
        vehicleId: result.data.vehicleId,
        type: result.data.type,
        date: result.data.date,
        mileage: result.data.mileage,
        notes: result.data.notes
    };

    const response = await fetch(getGraphQLUrl(), {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
            mutation createMaintenanceLog($vehicleId: ID!, $type: String!, $date: String!, $mileage: Int!, $notes: String){
                createMaintenance(vehicleId: $vehicleId, type: $type, date: $date, mileage: $mileage, notes: $notes ){
                    id
                    vehicle {
                        nickname
                    }
                }
            }
            `,
            variables: objectToSend
        })
    });

    if (!response.ok) {
        return { success: false, message: 'Something went wrong saving the vehicle maintenance log' };
    }

    const { data, errors } = await response.json();

    if (errors) {
        return { success: false, message: errors[0].message };
    }

    updateTag('get-cars');
    return { success: true, message: `Maintenance logged for ${data.createMaintenance.vehicle.nickname}` };

};

export async function deleteMaintenanceFromVehicle(_prevState: CreateGeneralMessage, id: string): Promise<CreateGeneralMessage> {

    const response = await fetch(getGraphQLUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `mutation deleteMaintenance($id: ID!){
                deleteMaintenance(id: $id)
            }`,
            variables: { id: id },
        })
    });


    if (!response.ok) return {
        success: false,
        message: "Something went wrong deleting the car log maintenance, please try again.",
    }

    const { data, errors } = await response.json();

    if (errors) {
        return { success: false, message: 'Something went wrong saving the vehicle maintenance.' };
    }

    if (!data.deleteMaintenance) {
        return { success: false, message: 'Log was not found — it may already be deleted.' };
    }

    updateTag('get-cars');

    return {
        message: 'Maintenance log was deleted.',
        success: true
    }
}

export async function deleteVehicleFromDB(_prevState: CreateGeneralMessage, id: string): Promise<CreateGeneralMessage> {


    const response = await fetch(getGraphQLUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `mutation deleteVehicle($id: ID!){
                deleteVehicle(id: $id)
                }`,
            variables: { id: id },
        })
    });

    if (!response.ok) return {
        success: false,
        message: "Something went wrong deleting the car, please try again."
    }

    const { data, errors } = await response.json();

    if (errors) {
        return { success: false, message: 'Something went wrong removing the vehicle.' };
    }

    if (!data.deleteVehicle) {
        return { success: false, message: 'Vehicle was not found — it may already be deleted.' };
    }

    updateTag('get-cars');

    return {
        message: 'Vehicle was deleted.',
        success: true
    }
}