/// <reference lib="dom" />

export function isRunningLocally(): boolean {
    return (
        Boolean(process.env.SST_DEV) || Boolean(process.env.IS_LOCAL) || (Boolean(process.env.IS_DEPLOYED_STAGE) && process.env.IS_DEPLOYED_STAGE !== 'true')
    );
}

export function isRunningInProd(): boolean {
    return (
        process.env.SST_STAGE === 'prod' ||
        process.env.SST_STAGE === 'production' ||
        (Boolean(process.env.IS_DEPLOYED_STAGE) && process.env.IS_DEPLOYED_STAGE === 'true')
    );
}

export function isRunningInBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}
