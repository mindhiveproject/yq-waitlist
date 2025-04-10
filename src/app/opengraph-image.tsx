import { ImageResponse } from "next/og";
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
 



// Image metadata
export const alt = "You: Quantified Waitlist";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const interFont = await readFile(
    join(process.cwd(), "assets/inter.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        You: Quantified
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
