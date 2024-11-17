<!-- <script lang="ts">
	import { nanoid } from 'nanoid/non-secure';
	export let id: string = nanoid();

	// let options: string = 'weekly'; // Default selection
	export let options: { value: string; text: string }[];
	export let value: string;

	export let label: string = '';
</script>

<div class="flex flex-col p-4 text-sm">
	<label class=" text-[#6C757D]" for={id}>{label}</label>
	<select class="text-sm" {id} bind:value={options}>
		<option value="weekly">Weekly</option>
		<option value="fortnightly">Fortnightly</option>
		<option value="semiMonthly">Semi-monthly</option>
		<option value="monthly">Monthly</option>
	</select>

	<div class="text-sm">
		<p>Selected: {options}</p>
	</div>
</div> -->
<!-- -------------------------------------------- -->
<script lang="ts">
	import { nanoid } from 'nanoid/non-secure';
	export let id: string = nanoid();

	export let value: string;
	export let options: { value: string; text: string }[];
	export let label;
</script>

<div class="flex flex-col gap-2 p-2 text-xs font-thin">
	<label class="text-xs text-[#6C757D]" for={id}>{label}</label>
	<select {id} bind:value class="rounded border border-gray-200 bg-white text-xs">
		{#each options as option}
			<option class="text-xs text-gray-500" value={option.value}>{option.text}</option>
		{/each}
	</select>
</div>
