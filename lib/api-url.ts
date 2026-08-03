export function getGraphQLUrl() {
    const endpoint = process.env.GRAPH_QL_ENDPOINT;

    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.BASE_API_URL;

    if (!baseUrl) {
        throw new Error('Missing BASE_API_URL or VERCEL_URL');
    }

    if (!endpoint) {
        throw new Error('Missing GRAPH_QL_ENDPOINT');
    }

    return `${baseUrl}${endpoint}`;
}