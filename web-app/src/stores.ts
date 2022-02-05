import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const keyStore = persistentWritable<string | null>('key', null);

export function persistentWritable<T = any> (key: string, value: T): Writable<T> {
	const defaultValue: T = localStorage.getItem(key) === null ? value : JSON.parse(localStorage.getItem(key));

	const store = writable<T>(defaultValue);
	store.subscribe(val => localStorage.setItem(key, JSON.stringify(val)));

	return store;
}