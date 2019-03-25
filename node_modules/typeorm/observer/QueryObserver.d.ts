/// <reference types="zen-observable" />
import { FindOptions } from "../find-options/FindOptions";
import { Connection, EntityMetadata, InsertEvent, ObjectLiteral, RemoveEvent, UpdateEvent } from "../index";
import Observable = require("zen-observable");
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
export declare class QueryObserver {
    connection: Connection;
    type: "find" | "findOne" | "findAndCount" | "count";
    metadata: EntityMetadata;
    options: FindOptions<any> | {
        [x: string]: any;
    } | {
        [x: string]: any;
    }[] | undefined;
    insertEvents: InsertEvent<any>[];
    updateEvents: UpdateEvent<any>[];
    removeEvents: RemoveEvent<any>[];
    isSubscriberActive: boolean;
    lastEmitEntities: ObjectLiteral[];
    lastEmitEntity: ObjectLiteral | undefined;
    lastEmitCount: number;
    subscriptionObserver: ZenObservable.SubscriptionObserver<any>;
    constructor(connection: Connection, type: "find" | "findOne" | "findAndCount" | "count", metadata: EntityMetadata, options?: FindOptions<any> | {
        [x: string]: any;
    } | {
        [x: string]: any;
    }[] | undefined);
    /**
     * Finds entities that match given options and returns observable.
     * Whenever new data appears that matches given query observable emits new value.
     */
    observe(): Observable<any>;
    private subscriber;
}
