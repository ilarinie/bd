-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StaticExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivatedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    CONSTRAINT "StaticExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StaticExpense" ("amount", "category", "createdAt", "description", "id", "updatedAt", "userId") SELECT "amount", "category", "createdAt", "description", "id", "updatedAt", "userId" FROM "StaticExpense";
DROP TABLE "StaticExpense";
ALTER TABLE "new_StaticExpense" RENAME TO "StaticExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
