import { Request } from 'express';
import trunc from 'math-trunc';
import { IPagination } from '../interface/IPagination';

export class Pagination {
	public static parse (request: Request): IPagination {
		const result: IPagination = {
			next: 2,
			offset: 0,
			page: 0,
			prev: null,
			sort: 'id',
			take: 50,
		};
		const per_page = 50;
		const sort = request.query.sort ? request.query.sort : 'id';
		let page: number = request.query.page ? +request.query.page : 0;
		result.sort = sort;
		result.page = page;
		result.take = per_page;
		result.offset = page * per_page;

		if (page === 0) {
			page = 1;
		}
		page++;
		if (page > 1) {
			result.prev = page - 2;
		}
		result.next = page;

		return result;
	}

	public static total (total: number, take: number): number {
		return trunc(total / take);
	}
}
