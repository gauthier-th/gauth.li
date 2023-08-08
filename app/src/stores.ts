import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { browser } from "$app/environment";

export const keyStore = persistentWritable<string | null>("key", null);
export const usernameStore = persistentWritable<string | null>("username", null);

export function persistentWritable<T = any> (key: string, value: T): Writable<T> {
  const defaultValue: T = !browser || localStorage.getItem(key) === null ? value : JSON.parse(localStorage.getItem(key) || "");

  const store = writable<T>(defaultValue);
  store.subscribe((val) => browser && localStorage.setItem(key, JSON.stringify(val)));

  return store;
}