export function getGraphQLUrl() {
    const endpoint = process.env.GRAPH_QL_ENDPOINT;

    const baseUrl = process.env.BASE_API_URL
        ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : undefined);

    if (!baseUrl) {
        throw new Error('Missing BASE_API_URL or VERCEL_URL');
    }

    if (!endpoint) {
        throw new Error('Missing GRAPH_QL_ENDPOINT');
    }

    return `${baseUrl}${endpoint}`;
}
