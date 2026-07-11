declare module "tablestore" {
  const TableStore: {
    Client: new (options: Record<string, string>) => {
      getRange: (
        params: Record<string, unknown>,
        callback: (err: Error | null, data: unknown) => void,
      ) => void;
    };
    Direction: {
      FORWARD: unknown;
    };
    INF_MIN: unknown;
    INF_MAX: unknown;
  };
  export default TableStore;
}
