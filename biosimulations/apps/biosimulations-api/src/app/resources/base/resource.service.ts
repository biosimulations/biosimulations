export abstract class ResourceService<T> {
  getAll() {}
  getOne(id: string) {}
  createOne(body: T) {}
  deleteOne(id: string) {}
  replaceOne() {}
  updateOne() {}
}
