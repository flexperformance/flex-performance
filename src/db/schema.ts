import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  engine: text("engine"),
  service: text("service").notNull(),
  preferredDate: text("preferred_date"),
  message: text("message"),
  status: text("status").notNull().default("nouvelle"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
