export interface IPagination {
	sort: string;
	page: number;
	offset: number;
	take: number;
	next: number | null;
	prev: number | null;
}
