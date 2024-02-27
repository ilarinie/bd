/*
  Warnings:

  - You are about to drop the column `type` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `category` to the `StaticExpense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StaticExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    CONSTRAINT "StaticExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StaticExpense" ("amount", "createdAt", "description", "id", "updatedAt", "userId") SELECT "amount", "createdAt", "description", "id", "updatedAt", "userId" FROM "StaticExpense";
DROP TABLE "StaticExpense";
ALTER TABLE "new_StaticExpense" RENAME TO "StaticExpense";
CREATE TABLE "new_Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budgetId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Purchase_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "MonthlyBudget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("amount", "budgetId", "createdAt", "description", "id", "updatedAt") SELECT "amount", "budgetId", "createdAt", "description", "id", "updatedAt" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
