export function isRunningLocally(): boolean {
    return !!process.env.SST_DEV;
}

export function isRunningInProd(): boolean {
    return process.env.SST_STAGE === 'prod';
}
