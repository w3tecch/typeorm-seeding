export const isPromiseLike = (o: any): o is Promise<any> =>
  o && Object.prototype.toString.call(o) === '[object Promise]'
