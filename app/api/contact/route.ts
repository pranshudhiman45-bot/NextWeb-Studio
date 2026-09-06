import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { contactSchema } from "@/lib/validations";
import { Contact } from "@/models/Contact";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the highlighted fields.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await connectToDatabase();
    await Contact.create(result.data);

    return NextResponse.json(
      {
        success: true,
        message:
          "Thanks for reaching out. Your project inquiry has been received. I’ll get back to you soon.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
