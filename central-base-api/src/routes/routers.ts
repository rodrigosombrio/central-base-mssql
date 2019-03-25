import { IPagination } from '../interface/IPagination';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';

export class BaseRouter {
	public async json (entity: any, table: string, pagination: IPagination) {
		const db: Database = new Database();
		const records: any = await db
			.repository(entity)
			.createQueryBuilder(table)
			.orderBy(pagination.sort)
			.offset(pagination.offset)
			.take(pagination.take)
			.cache(true)
			.getManyAndCount();
		const list = records[0];
		const count = records[1];
		const total = Pagination.total(count, pagination.take);
		let next = null;
		if (pagination.page < total) {
			next = 'http://localhost/api/v1/basecentralizada/' + table + '?page=' + pagination.next;
		}
		let prev = null;
		if (pagination.page > 1) {
			if (pagination.page > total) {
				prev = 'http://localhost/api/v1/basecentralizada/' + table + '?page=' + total;
			} else {
				prev = 'http://localhost/api/v1/basecentralizada/' + table + '?page=' + pagination.prev;
			}
		}
		const json = {
			count,
			next_page: next,
			prev_page: prev,
		};
		json[table] = list;

		return json;
	}
}
