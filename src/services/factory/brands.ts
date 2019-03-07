public static entity: any = {};
public static addRow (json: any): any {
    const self = this;
    return new Promise((resolve, reject) => {
        const request: Request = db.request;
        request
            .input('id', json.id)
            .query('select * from Brands where [id] = @id')
            .then((result) => {
                self.entity.insert = result.recordset.length === 0;
                self.entity.update = result.recordset.length !== 0;
                for (const key in json) {
                    if (json[key]) {
                        self.entity[key] = json[key];
                    }
                }
                resolve(self);
            });
    });
}
public static sql (): string {
    if (this.entity.insert) {
        return 'insert into Brands ([id], [name]) values (' + this.entity.id + ", '" + this.entity.name + "')";
    }
    return (
        "update Brands set [name] = '" +
        this.entity.name +
        "', [created_at] = '" +
        this.entity.created_at +
        "', [url] = '" +
        this.entity.url +
        "', [updated_at] = '" +
        this.entity.updated_at +
        "', [brand_url] = '" +
        this.entity.brand_url +
        "', [has_help_center] = " +
        (this.entity.has_help_center ? 1 : 0) +
        ", [help_center_state] = '" +
        this.entity.help_center_state +
        "', [active] = " +
        (this.entity.active ? 1 : 0) +
        ', [default] = ' +
        (this.entity.default ? 1 : 0) +
        (this.entity.logo ? ', [logo_id] = ' + this.entity.logo.id : '') +
        (this.entity.logo ? ", [logo_url] = '" + this.entity.logo.url + "'" : '') +
        (this.entity.logo ? ", [logo_file_name] = '" + this.entity.logo.file_name + "'" : '') +
        (this.entity.logo ? ", [logo_content_url] = '" + this.entity.logo.content_url + "'" : '') +
        (this.entity.logo ? ", [logo_mapped_content_url] = '" + this.entity.logo.mapped_content_url + "'" : '') +
        (this.entity.logo ? ", [logo_content_type] = '" + this.entity.logo.content_type + "'" : '') +
        (this.entity.logo ? ", [logo_size] = '" + this.entity.logo.size + "'" : '') +
        ", [host_mapping] = '" +
        this.entity.host_mapping +
        "', [subdomain] = '" +
        this.entity.subdomain +
        "', [signature_template] = '" +
        this.entity.signature_template +
        "', [is_deleted] = " +
        (this.entity.is_deleted ? 1 : 0) +
        ' where [id] = ' +
        this.entity.id
    );
}
public tableName: string = 'Brands';
