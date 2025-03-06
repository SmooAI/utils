import Logger from '@smooai/logger/Logger';
import { findUp, findUpSync } from 'find-up';

const logger = new Logger({ name: 'findFile' });

export const findFile = async (filename: string, options?: { logError: boolean }) => {
    const logError = options?.logError ?? true;
    try {
        const foundPath = await findUp(filename);
        if (!foundPath) {
            throw new Error(`Unable to find ${filename}`);
        }
        return foundPath;
    } catch (error) {
        if (logError) logger.error(error, `Error finding file '${filename}`);
        throw error;
    }
};

export const findFileSync = (filename: string, options?: { logError: boolean }) => {
    const logError = options?.logError ?? true;
    try {
        const foundPath = findUpSync(filename);
        if (!foundPath) {
            throw new Error(`Unable to find ${filename}`);
        }
        return foundPath;
    } catch (error) {
        if (logError) logger.error(error, `Error finding file '${filename}`);
        throw error;
    }
};
