import { vehicles, maintenanceRecords } from '@/lib/data';
import { createSchema, createYoga } from 'graphql-yoga';

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
        type: String!,
        date: String!,
        mileage: Int!,
        notes: String,
    }

    type Query {
        vehicles: [Vehicle!]!
        vehicle(id: ID!): Vehicle
    }
`;

const resolvers = {
    Query: {
        vehicles: () => vehicles,
        vehicle: (_: any, { id }: { id: string }) => vehicles.find(vehicle => vehicle.id === id)
    },
    Vehicle: {
        records: (parent: { id: string }) => maintenanceRecords.filter(record => record.vehicleId === parent.id)
    }
};

const { handleRequest } = createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: '/api/graphql',
    fetchAPI: { Response },
    graphiql: !isProduction && true
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
