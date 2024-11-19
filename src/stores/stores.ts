// // stores.js
// import { writable } from 'svelte/store';

// // Initialize the writable store
// export const arrayOfIncomeInputData = writable([]);

// stores.js
import { writable } from 'svelte/store';
import type { IncomeInputData } from '../stores/types'; // Adjust the path

// Initialize the writable store with a typed array
export const arrayOfIncomeInputData = writable<IncomeInputData[]>([]);
