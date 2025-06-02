import { PrismaClient } from '@prisma/client';
import type { CursorStore } from '../interface';

/**
 * Prisma-backed implementation of CursorStore for persistent cursor tracking.
 */
export class PrismaCursorStore implements CursorStore {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? new PrismaClient();
  }

  async getCursor(eventName: string): Promise<string | null> {
    const record = await this.prisma.cursor.findUnique({ where: { id: eventName } });
    return record?.cursor ?? null;
  }

  async saveCursor(eventName: string, cursor: string | null): Promise<void> {
    if (cursor === null) {
      await this.prisma.cursor.delete({ where: { id: eventName } }).catch(() => {});
    } else {
      await this.prisma.cursor.upsert({
        where: { id: eventName },
        update: { cursor },
        create: { id: eventName, cursor },
      });
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
