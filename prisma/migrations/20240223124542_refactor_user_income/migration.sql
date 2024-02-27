/*
  Warnings:

  - You are about to drop the column `endTime` on the `UserIncome` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `UserIncome` table. All the data in the column will be lost.
  - Added the required column `endMonth` to the `UserIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endYear` to the `UserIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMonth` to the `UserIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `UserIncome` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserIncome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "startMonth" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endMonth" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserIncome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserIncome" ("amount", "createdAt", "id", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "updatedAt", "userId" FROM "UserIncome";
DROP TABLE "UserIncome";
ALTER TABLE "new_UserIncome" RENAME TO "UserIncome";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
