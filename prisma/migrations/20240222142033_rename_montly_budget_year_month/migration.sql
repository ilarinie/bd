/*
  Warnings:

  - You are about to drop the column `startMonth` on the `MonthlyBudget` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `MonthlyBudget` table. All the data in the column will be lost.
  - Added the required column `month` to the `MonthlyBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `MonthlyBudget` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthlyBudget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "budget" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyBudget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MonthlyBudget" ("budget", "createdAt", "id", "updatedAt", "userId") SELECT "budget", "createdAt", "id", "updatedAt", "userId" FROM "MonthlyBudget";
DROP TABLE "MonthlyBudget";
ALTER TABLE "new_MonthlyBudget" RENAME TO "MonthlyBudget";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
