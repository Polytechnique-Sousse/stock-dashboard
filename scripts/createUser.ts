import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  const user = await prisma.user.create({
    data: {
      email: "roua@gmail.com", 
      password: hashedPassword,
    },
  });

  console.log("User créé :", user);
}

main()
  .catch(console.error)
  .finally(() => process.exit());