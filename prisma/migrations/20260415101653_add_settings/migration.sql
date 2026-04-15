-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'TND',
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "lowStock" BOOLEAN NOT NULL DEFAULT false,
    "emailNotif" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
