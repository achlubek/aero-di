export class InstancesCache {
  private readonly createdInstances: Record<string, object> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public save(name: string, instance: object): void {
    this.createdInstances[name] = instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get(name: string): object | undefined {
    return this.createdInstances[name];
  }
}
