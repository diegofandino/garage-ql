import { vehicles, maintenanceRecords, Vehicle, MaintenanceRecord } from '@/lib/data';
import { createSchema, createYoga } from 'graphql-yoga';
import { GraphQLError } from 'graphql';
import { randomUUID } from 'crypto'

const isProduction = process.env.NODE_ENV === 'production';

const typeDefs = `
    type Vehicle {
        id: ID!,
        nickname: String!,
        make: String!,
        model: String!,
        year: Int!,
        plate: String!,
        records: [MaintenanceRecord!]!
    }

    type MaintenanceRecord {
        id: ID!,
        vehicleId: ID!,
        vehicle: Vehicle!,
        type: String!,
        date: String!,
        mileage: Int!,
        notes: String,
    }

    type Query {
        vehicles: [Vehicle!]!
        vehicle(id: ID!): Vehicle
    }
    
    type Mutation {
        createVehicle( nickname: String!, make: String!, model: String!, year: Int!, plate: String!): Vehicle!
        createMaintenance( vehicleId: ID!, type: String!, date: String!, mileage: Int!, notes: String): MaintenanceRecord!
        deleteMaintenance(id: ID!): Boolean
        deleteVehicle(id: ID!): Boolean
    }
`;

const resolvers = {
    Query: {
        vehicles: () => vehicles,
        vehicle: (_: any, { id }: { id: string }) => vehicles.find(vehicle => vehicle.id === id)
    },
    Mutation: {
        createVehicle: (_parent: unknown, {
            nickname,
            make,
            model,
            year,
            plate
        }: Vehicle) => {
            const newId = randomUUID();
            vehicles.push({
                id: newId.toString(),
                nickname, make, model, year, plate
            });

            return vehicles.find(vehicle => vehicle.id === newId.toString());
        },
        createMaintenance: (_parent: unknown, {
            vehicleId,
            type,
            date,
            mileage,
            notes
        }: MaintenanceRecord) => {
            if (!vehicles.some(vehicle => vehicle.id === vehicleId)) {
                throw new GraphQLError(
                    `No vehicle found with id "${vehicleId}".`,
                    { extensions: { code: 'BAD_USER_INPUT' } }
                );
            }

            if (Number.isNaN(new Date(date).getTime())) {
                throw new GraphQLError(
                    `"${date}" is not a valid date.`,
                    { extensions: { code: 'BAD_USER_INPUT' } }
                );
            }

            const existingRecords = maintenanceRecords.filter(record => record.vehicleId === vehicleId);
            const latestRecord = existingRecords.reduce((latest, record) =>
                !latest || new Date(record.date) > new Date(latest.date) ? record : latest
                , existingRecords[0]);

            if (latestRecord && new Date(date) < new Date(latestRecord.date)) {
                throw new GraphQLError(
                    `Date must be on or after the latest record (${latestRecord.date}).`,
                    { extensions: { code: 'BAD_USER_INPUT' } }
                );
            }

            const newId = randomUUID();
            maintenanceRecords.push({
                id: newId.toString(),
                vehicleId, type, date, mileage, notes
            });

            return maintenanceRecords.find(maintenance => maintenance.id === newId.toString());
        },
        deleteMaintenance: (_parent: unknown, { id }: { id: string }) => {
            const indexOfMaintenance = maintenanceRecords.findIndex(record => record.id === id);
            if (indexOfMaintenance === -1) return false;
            maintenanceRecords.splice(indexOfMaintenance, 1);
            return true;
        },
        deleteVehicle: (_parent: unknown, { id }: { id: string }) => {
            const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === id);
            if (vehicleIndex === -1) return false;
            vehicles.splice(vehicleIndex, 1);

            for (let i = maintenanceRecords.length - 1; i >= 0; i--) {
                if (maintenanceRecords[i].vehicleId === id) {
                    maintenanceRecords.splice(i, 1);
                }
            }

            return true;
        }
    },
    Vehicle: {
        records: (parent: { id: string }) => maintenanceRecords.filter(record => record.vehicleId === parent.id)
    },
    MaintenanceRecord: {
        vehicle: (parent: { vehicleId: string }) => vehicles.find(vehicle => vehicle.id === parent.vehicleId)
    }
};

const { handleRequest } = createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: '/api/graphql',
    fetchAPI: { Response },
    graphiql: !isProduction && true
});

export async function GET(request: Request): Promise<Response> {
    return handleRequest(request, {});
}

export async function POST(request: Request): Promise<Response> {
    return handleRequest(request, {});
}

export async function OPTIONS(request: Request): Promise<Response> {
    return handleRequest(request, {});
}
