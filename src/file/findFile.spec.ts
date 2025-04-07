import { findUp, findUpSync } from 'find-up';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { findFile, findFileSync } from './findFile';

// Mock the find-up package
vi.mock('find-up', () => ({
    findUp: vi.fn(),
    findUpSync: vi.fn(),
}));

// Mock the logger
vi.mock('@smooai/logger/Logger', () => {
    return {
        default: class Logger {
            constructor() {}
            error: Mock = vi.fn();
        },
    };
});

describe('findFile utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('findFile', () => {
        it('should find a file successfully', async () => {
            const expectedPath = '/path/to/file.txt';
            vi.mocked(findUp).mockResolvedValue(expectedPath);

            const result = await findFile('file.txt');
            expect(result).toBe(expectedPath);
            expect(findUp).toHaveBeenCalledWith('file.txt');
        });

        it('should throw error when file is not found', async () => {
            vi.mocked(findUp).mockResolvedValue(undefined);

            await expect(findFile('nonexistent.txt')).rejects.toThrow('Unable to find nonexistent.txt');
        });

        it('should not log error when logError option is false', async () => {
            vi.mocked(findUp).mockRejectedValue(new Error('Some error'));

            await expect(findFile('file.txt', { logError: false })).rejects.toThrow('Some error');
        });
    });

    describe('findFileSync', () => {
        it('should find a file successfully', () => {
            const expectedPath = '/path/to/file.txt';
            vi.mocked(findUpSync).mockReturnValue(expectedPath);

            const result = findFileSync('file.txt');
            expect(result).toBe(expectedPath);
            expect(findUpSync).toHaveBeenCalledWith('file.txt');
        });

        it('should throw error when file is not found', () => {
            vi.mocked(findUpSync).mockReturnValue(undefined);

            expect(() => findFileSync('nonexistent.txt')).toThrow('Unable to find nonexistent.txt');
        });

        it('should not log error when logError option is false', () => {
            vi.mocked(findUpSync).mockImplementation(() => {
                throw new Error('Some error');
            });

            expect(() => findFileSync('file.txt', { logError: false })).toThrow('Some error');
        });
    });
});
