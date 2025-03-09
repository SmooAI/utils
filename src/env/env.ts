export function isRunningLocally(): boolean {
    return !!process.env.SST_DEV || !!process.env.IS_LOCAL;
}

export function isRunningInProd(): boolean {
    return process.env.SST_STAGE === 'prod';
}
