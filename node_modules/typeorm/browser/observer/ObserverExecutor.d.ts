import { QueryObserver } from "./QueryObserver";
/**
 * Executes all given observers.
 */
export declare class ObserverExecutor {
    private observers;
    constructor(observers: QueryObserver[]);
    /**
     * Executes given observers.
     */
    execute(): Promise<void>;
    private handleInsertEvent(observer);
    private findInserted(metadata, entities, lastEmitEntities);
    private handleUpdateEvent(observer);
    private hasChanges(observer, entity);
    private handleRemoveEvent(observer);
    private hasRemoved(observer, entities);
}
