export interface IZendeskImport {
    run (): Promise<any>,
    import (): Promise<any>,
    saveDb (): Promise<any>
}