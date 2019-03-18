import { Cache } from '../../cache';
import { IZendeskImport } from '../../interface/IZendeskImport';
import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
import { Zendesk } from '../zendesk';
import { log } from './logs';

const db: Database = new Database();

export class Page implements IZendeskImport {
    private _config: Configuration;
    private _url: string;
    private _content: any;
    private _page: number;

    constructor (config: Configuration) {
        this._config = config;
        this._url = '';
        this._content = [];
        this._page = 0;
    }
    public async import () {
        console.log('import page')
        const baseUri = Cache.get('baseUriZendesk');
        this._url = baseUri + this._config.url + '?page=' + (this._config.lastPage - 1);
        const result = await this.run();
        return result;
    }
    public async run () {
        let next: boolean = true;
        let url: string = this._url;
        while (next) {
            console.log('url page', url)
            const result: any = await Zendesk.json(url);
            const items = result[this._config.tableToParse.toLowerCase()];
            this._content = this._content.concat(items);
            if (result.next_page) {
                url = result.next_page;
            } else {
                this._page = +(url.substring(url.lastIndexOf('=') + 1));
                next = false;
            }
        }
        console.log('savedb page')
        const f = await this.saveDb();
        return f;
    }
    public async saveDb () {
        const config = { inExecution: true };
        await db.manager.update(Configuration, { id: this._config.id }, config);
        await log('START', this._config, '', '');
        for (const content of this._content) {
            console.log('content', content);
            try {
                const dynamic = new DynamicModel(this._config.tableToParse);
                const schema: any = dynamic.schema;
                if (schema) {
                    if (this._config.beforeClean) {
                        await db.manager.remove(schema);
                    }

                    const entity: any = db.manager.create(schema, content);
                    const key = entity.url ? entity.url : entity.id;
                    const entitydb = await db.manager.find(schema, {
                        url: entity.url,
                    });
                    if (entitydb.length > 0) {
                        await log('UPDATE', this._config, JSON.stringify(content), key);
                        await db.manager.update(schema, { url: key }, content);
                    } else {
                        await log('INSERT', this._config, entity, key);
                        await db.manager.save(schema, entity);
                    }
                }
            } catch(err) {
                await log('ERROR', this._config, err, this._config.id.toString());
            }
        }
        await db.manager.update(
            Configuration,
            { id: this._config.id },
            { inExecution: false, lastExecuteAt: new Date(), lastPage: this._page },
        );
        await log('FINISH', this._config, '', '');

        return true;
    }}