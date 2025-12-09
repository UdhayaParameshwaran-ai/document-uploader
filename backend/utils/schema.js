import {
  bigint,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const documentTable = pgTable("document", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  filename: varchar().notNull(),
  filepath: varchar().notNull(),
  filesize: integer().notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
