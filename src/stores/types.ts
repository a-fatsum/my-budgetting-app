import { Temporal } from '@js-temporal/polyfill';

// export type IncomeInputData = {
// 	incomeFrequency?: string;
// 	incomeAmount?: number;
// 	incomeDate?: Temporal.PlainDate;
// };
export type IncomeInputData = {
	incomeLabel?: string;
	incomeFrequency?: string;
	incomeAmount?: number;
	incomeDate?: Temporal.PlainDate;
};
