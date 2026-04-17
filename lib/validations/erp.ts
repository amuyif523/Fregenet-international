import { z } from 'zod';

// Enum Validations
export const TransactionTypeEnum = z.enum(['CASH', 'IN_KIND']);
export const TransactionCategoryEnum = z.enum(['NUTRITION', 'SALARY', 'CONSTRUCTION', 'UTILITIES', 'SUPPLIES', 'REVENUE']);
export const StudentStatusEnum = z.enum(['ACTIVE', 'GRADUATED', 'DROPPED', 'PROSPECTIVE']);
export const AssetConditionEnum = z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'BROKEN']);
export const FundRestrictionEnum = z.enum(['UNRESTRICTED', 'RESTRICTED']);
export const JournalEntryTypeEnum = z.enum(['DEBIT', 'CREDIT']);
export const TransactionStatusEnum = z.enum(['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED']);
export const DonationSourceEnum = z.enum(['STRIPE', 'BANK_TRANSFER', 'CASH', 'IN_KIND']);

// Model Validations
export const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.coerce.date(),
  gender: z.string().min(1, 'Gender is required'),
  status: StudentStatusEnum.default('ACTIVE'),
  bio: z.string().optional(),
  school: z.string().min(1).default('Denbi'),
});

export const erpAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  code: z.string().min(1, 'Account code is required'),
  balance: z.coerce.number().default(0),
});

/**
 * CRITICAL RULE: Double-Entry Accounting
 * Every Transaction must have Journal Entries that sum to zero (Debits = Credits).
 */
export const erpTransactionSchema = z.object({
  type: TransactionTypeEnum,
  category: TransactionCategoryEnum,
  status: TransactionStatusEnum.default('PENDING_VERIFICATION'),
  source: DonationSourceEnum.default('CASH'),
  description: z.string().min(1, 'Description is required'),
  date: z.coerce.date().default(() => new Date()),
  
  // Intake Metadata
  originalAmount: z.coerce.number().optional(),
  originalCurrency: z.string().default('ETB'),
  baseAmount: z.coerce.number().optional(),
  
  donorName: z.string().optional().nullable(),
  donorEmail: z.string().email().optional().nullable().or(z.literal('')),
  referenceId: z.string().optional().nullable(),
  donorIntent: z.string().optional().nullable(),

  isRestricted: z.boolean().default(false),
  fundRestriction: FundRestrictionEnum.default('UNRESTRICTED'),
  projectId: z.string().optional().nullable(),
});

export const erpJournalEntrySchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: JournalEntryTypeEnum,
  accountId: z.string().min(1, 'Account ID is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
});

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().int().nonnegative('Quantity cannot be negative'),
  valuation: z.coerce.number().nonnegative('Valuation cannot be negative'),
  condition: AssetConditionEnum.default('GOOD'),
  location: z.string().min(1, 'Location is required'),
  isConsumable: z.boolean().default(false),
});

export const staffSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  role: z.string().min(1, 'Role is required'),
  hireDate: z.coerce.date().default(() => new Date()),
  isActive: z.boolean().default(true),
});

export const nutritionalLogSchema = z.object({
  date: z.coerce.date().default(() => new Date()),
  mealType: z.string().min(1, 'Meal type is required'),
  menu: z.string().min(1, 'Menu details are required'),
  studentCount: z.coerce.number().int().positive('Student count must be positive'),
  school: z.string().min(1, 'School is required'),
  absenteeIds: z.array(z.string()).default([]),
});

export const healthRecordSchema = z.object({
  date: z.coerce.date().default(() => new Date()),
  height: z.coerce.number().positive('Height must be positive'),
  weight: z.coerce.number().positive('Weight must be positive'),
  bmi: z.coerce.number().optional(),
  studentId: z.string().min(1, 'Student ID is required'),
});

export type StudentInput = z.infer<typeof studentSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type ErpAccountInput = z.infer<typeof erpAccountSchema>;
export type ErpTransactionInput = z.infer<typeof erpTransactionSchema>;
export type ErpJournalEntryInput = z.infer<typeof erpJournalEntrySchema>;
export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
export type NutritionalLogInput = z.infer<typeof nutritionalLogSchema>;
export type HealthRecordInput = z.infer<typeof healthRecordSchema>;


