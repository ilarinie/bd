-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserIncome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "startMonth" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endMonth" INTEGER,
    "endYear" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserIncome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserIncome" ("amount", "createdAt", "endMonth", "endYear", "id", "startMonth", "startYear", "updatedAt", "userId") SELECT "amount", "createdAt", "endMonth", "endYear", "id", "startMonth", "startYear", "updatedAt", "userId" FROM "UserIncome";
DROP TABLE "UserIncome";
ALTER TABLE "new_UserIncome" RENAME TO "UserIncome";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
