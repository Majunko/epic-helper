import ms from 'ms';
import type {StringValue} from 'ms';

export const parseMs = (value: string): number => ms(value as StringValue);
