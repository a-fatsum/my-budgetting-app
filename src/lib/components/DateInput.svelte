<script lang="ts">
	import { nanoid } from 'nanoid/non-secure';
	import { Temporal } from '@js-temporal/polyfill';

	let rawValue: string = ''; // This will bind directly to the input field.

	// External value prop (binded from parent)
	export let value: string | null = null;
	// Date prop that is set based on 'value'
	export let date: Temporal.PlainDate | null = null;
	// Optional label
	export let label: string = '';
	// Unique ID for the input field
	export let id: string = nanoid();

	// Update rawValue when 'value' changes
	$: {
		if (value && value !== rawValue) {
			rawValue = value;
		}
	}

	// Update 'date' based on 'rawValue' (string) whenever 'rawValue' changes
	$: {
		if (rawValue) {
			try {
				date = Temporal.PlainDate.from(rawValue); // Convert rawValue to Temporal date
			} catch (error) {
				date = null; // If the rawValue is invalid, set date to null
			}
		} else {
			date = null; // Reset date when rawValue is empty
		}
	}

	// On input, update 'value' with rawValue (date string)
	const onInput = () => {
		value = rawValue ? rawValue : null; // Set 'value' to null if the input is empty
	};
</script>

<div class="flex flex-col gap-2 p-2 text-xs font-thin">
	<label class=" text-xs text-[#6C757D]" for={id}>{label}</label>
	<input
		class="rounded border border-gray-200 bg-white text-xs"
		{id}
		type="date"
		bind:value={rawValue}
		on:input={onInput}
	/>
</div>

<!-- class="border-none border-transparent px-1 py-1 outline-none focus:border-transparent focus:ring-0" -->
