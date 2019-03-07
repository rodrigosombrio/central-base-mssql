export class Configuration {
	public entity: any = {};
	public set (json: any) {
		for (const key in json) {
			if (json[key]) {
				this.entity[key] = json[key];
			}
		}
	}
	public get url (): string {
		return this.entity.url;
	}
	public get table (): string {
		return this.entity.table_to_parse;
	}
}
