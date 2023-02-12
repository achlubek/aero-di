export const register = <T>(iname: string, concrete: new () => T): void => {
  const cname = concrete.name;
  console.log(iname);
  console.log(cname);
};
