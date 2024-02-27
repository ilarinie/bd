/*
  Warnings:

  - You are about to drop the column `monthlyBudgetId` on the `StaticExpense` table. All the data in the column will be lost.
  - Added the required column `type` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budgetId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Purchase_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "MonthlyBudget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("amount", "budgetId", "createdAt", "description", "id", "updatedAt") SELECT "amount", "budgetId", "createdAt", "description", "id", "updatedAt" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "salaryAfterTaxes" REAL
);
INSERT INTO "new_User" ("hashed_password", "id", "salaryAfterTaxes", "username") SELECT "hashed_password", "id", "salaryAfterTaxes", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_StaticExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StaticExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StaticExpense" ("amount", "createdAt", "description", "id", "updatedAt", "userId") SELECT "amount", "createdAt", "description", "id", "updatedAt", "userId" FROM "StaticExpense";
DROP TABLE "StaticExpense";
ALTER TABLE "new_StaticExpense" RENAME TO "StaticExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
