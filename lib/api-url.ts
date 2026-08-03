export function getGraphQLUrl() {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.BASE_API_URL;

    return `${baseUrl}${process.env.GRAPH_QL_ENDPOINT}`;
}
