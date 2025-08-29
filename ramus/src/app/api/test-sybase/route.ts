import { NextResponse } from "next/server";
import Sybase from "sybase-promised";
import path from "path";

export async function GET() {
  const jarPath = path.resolve(
    process.cwd(),
    "public/JavaSybaseLink/dist/JavaSybaseLink.jar"
  );

  const db = new Sybase(
    {
      host: "10.30.1.148",
      port: 10000,
      dbname: "banking",
      username: "sa",
      password: "neptune64",
    },
    jarPath 
  );

  try {
    await db.connect();
    const result = await db.query("SELECT GETDATE() AS currentDate");
    await db.disconnect();

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
