import { describe, it, expect } from 'vitest';
import { CaseInsensitiveSet } from './CaseInsensitiveSet';

describe('CaseInsensitiveSet', () => {
    it('should create an empty set', () => {
        const set = new CaseInsensitiveSet();
        expect(set.size).toBe(0);
    });

    it('should create a set with initial values', () => {
        const set = new CaseInsensitiveSet(['Hello', 'World']);
        expect(set.size).toBe(2);
    });

    it('should handle case-insensitive string operations', () => {
        const set = new CaseInsensitiveSet<string>();
        
        set.add('Hello');
        expect(set.has('hello')).toBe(true);
        expect(set.has('HELLO')).toBe(true);
        expect(set.has('Hello')).toBe(true);
        
        set.add('WORLD');
        expect(set.has('world')).toBe(true);
        expect(set.has('World')).toBe(true);
    });

    it('should handle non-string values', () => {
        const set = new CaseInsensitiveSet<number | string>();
        
        set.add(42);
        set.add('Hello');
        
        expect(set.has(42)).toBe(true);
        expect(set.has('HELLO')).toBe(true);
    });

    it('should properly delete items case-insensitively', () => {
        const set = new CaseInsensitiveSet(['Hello', 'World']);
        
        expect(set.delete('HELLO')).toBe(true);
        expect(set.has('hello')).toBe(false);
        expect(set.size).toBe(1);
    });

    it('should handle mixed case initial values', () => {
        const set = new CaseInsensitiveSet(['Hello', 'WORLD', 'TeSt']);
        
        expect(set.has('hello')).toBe(true);
        expect(set.has('world')).toBe(true);
        expect(set.has('test')).toBe(true);
        expect(set.size).toBe(3);
    });
}); 