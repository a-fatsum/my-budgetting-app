<script lang="ts">
	import { nanoid } from 'nanoid/non-secure';
	import { Temporal } from '@js-temporal/polyfill';

	let rawValue: string = ''; // This will bind directly to the input field.

	export let value: string | null = null; // External value prop (binded from parent).
	export let date: Temporal.PlainDate | null = null; // Date prop that is set based on 'value'.
	export let label: string = ''; // Optional label.
	export let id: string = nanoid(); // Unique ID for the input field.

	// Update rawValue when 'value' changes
	$: {
		if (value && value !== rawValue) {
			rawValue = value;
		}
	}

	// Update 'date' based on 'value' (string) whenever 'value' changes
	$: {
		if (rawValue) {
			date = Temporal.PlainDate.from(rawValue);
		} else {
			date = null;
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
