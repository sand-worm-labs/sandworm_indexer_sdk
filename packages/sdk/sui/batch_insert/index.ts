export class BatchInsert<T> {
  data: T[];
  skipDuplicates: boolean;
  constructor(data: T[], skipDuplicates = false) {
    this.data = data;
    this.skipDuplicates = skipDuplicates;
  }

  add(item: T) {
    this.data.push(item);
  }
  size(): number {
    return this.data.length;
  }

}