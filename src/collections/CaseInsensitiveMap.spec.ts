import { CaseInsensitiveMap } from './CaseInsensitiveMap';
import { describe, it, expect } from 'vitest';

describe('CaseInsensitiveMap', () => {
    it('should create an empty map', () => {
        const map = new CaseInsensitiveMap();
        expect(map.size).toBe(0);
    });

    it('should create a map with initial values', () => {
        const map = new CaseInsensitiveMap([
            ['Hello', 1],
            ['World', 2],
        ]);
        expect(map.size).toBe(2);
    });

    it('should handle case-insensitive keys for set and get operations', () => {
        const map = new CaseInsensitiveMap<string, number>();

        map.set('Hello', 1);
        expect(map.get('HELLO')).toBe(1);
        expect(map.get('hello')).toBe(1);
        expect(map.get('HeLLo')).toBe(1);
    });

    it('should handle case-insensitive keys for has operation', () => {
        const map = new CaseInsensitiveMap<string, number>();

        map.set('Hello', 1);
        expect(map.has('HELLO')).toBe(true);
        expect(map.has('hello')).toBe(true);
        expect(map.has('HeLLo')).toBe(true);
        expect(map.has('World')).toBe(false);
    });

    it('should handle non-string keys', () => {
        const map = new CaseInsensitiveMap<string | number, string>();

        map.set('Hello', 'world');
        map.set(123, 'number');

        expect(map.get(123)).toBe('number');
        expect(map.get('HELLO')).toBe('world');
    });

    it('should handle multiple set operations with different cases', () => {
        const map = new CaseInsensitiveMap<string, number>();

        map.set('Hello', 1);
        map.set('HELLO', 2);
        map.set('hello', 3);

        expect(map.size).toBe(1);
        expect(map.get('hello')).toBe(3);
    });
});
