export function isRunningLocally(): boolean {
    return !!process.env.SST_DEV || !!process.env.IS_LOCAL || process.env.IS_DEPLOYED_STAGE !== 'true';
}

export function isRunningInProd(): boolean {
    return process.env.SST_STAGE === 'prod' || process.env.SST_STAGE === 'production' || process.env.IS_DEPLOYED_STAGE === 'true';
}
