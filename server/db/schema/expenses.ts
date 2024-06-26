import {
  numeric,
  text,
  pgTable,
  serial,
  index,
  timestamp,
  date,
  integer,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index('name_idx').on(expenses.userId),
    };
  }
);

export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z
    .string()
    .max(255, { message: 'Description is to long' })
    .optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: 'Amount must be a valid monetary value',
  }),
});

export const spentGoal = pgTable(
  'spentGoal',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    spentGoal: integer('spent_goal').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (spentGoal) => {
    return {
      userIdIndex: index('goal_idx').on(spentGoal.userId),
    };
  }
);

export const insertSpentGoalSchema = createInsertSchema(spentGoal, {
  spentGoal: z.number().nonnegative().default(0),
});

export const expenseSchema = createSelectSchema(expenses, {
  createdAt: z.string(),
  date: z.string(),
});

export const selectExpensesSchema = createSelectSchema(expenses);
