<script lang="ts">
	import { nanoid } from 'nanoid/non-secure';
	import { Temporal } from '@js-temporal/polyfill';

	//
	export let inputType: string = 'text'; // Default to 'text' if not provided
	export let label: string = '';
	export let id: string = nanoid();
	export let value: number = 0;
	// export let date: Date | null = null;
	// export let max: number | null = null;

	//
	// $: value = Math.max(max ? Math.min(value, max) : value, 0);
</script>

<div class="flex flex-col gap-2 p-2 text-xs font-thin">
	<label class=" text-xs text-[#6C757D]" for={id}>{label}</label>

	<input class="rounded border border-gray-200 bg-white text-xs" type={inputType} bind:value {id} />
</div>

<!-- class="border-none border-transparent px-1 py-1 outline-none focus:border-transparent focus:ring-0" -->

<!-- -->
<!-- __________________________________________________ -->
<!-- <script lang="ts">
	import { nanoid } from 'nanoid/non-secure';
	import { createEventDispatcher } from 'svelte';
	export let inputType = 'text'; // Default to 'text' if not provided
	export let label: string = '';
	export let value: number = 0;
	export let id: string = nanoid();
	export let placeholder: string = '';
	export let inputStyling: string = '';
	export let labelStyling: string = '';
	export let max: number | null = null;

	$: value = Math.max(max ? Math.min(value, max) : value, 0);

	const dispatch = createEventDispatcher();

	const onInput = () => {
		dispatch('input');
	};
</script>

<div class=" flex w-auto flex-col gap-2 font-light">
	<label class="text-sm text-[#6C757D] {labelStyling}" for={id}>{label}</label>

	<input
		class="w-full rounded-lg border bg-[#ffff] p-2 text-left text-sm text-gray-300 outline-none [appearance:textfield] focus:text-[#1e1e1e] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none {changeTextColorAfterInput(
			value
		)} {inputStyling}"
		{id}
		bind:value
		on:input={onInput}
		{placeholder}
		type={inputType}
	/>
</div> -->
