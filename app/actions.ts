'use server';
import { updateTag } from "next/cache";
import z from "zod";

export interface CreateVehicleMessage {
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
})

export async function createVehicle(_prevState: CreateVehicleMessage, formData: FormData): Promise<CreateVehicleMessage> {
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

    const response = await fetch(`${process.env.BASE_API_URL}${process.env.GRAPH_QL_ENDPOINT}`, {
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