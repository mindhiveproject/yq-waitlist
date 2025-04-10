export async function POST(req: Request) {

  const { email, selectedRole } = await req.json();

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_PAGE_ID },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: "YQ Website Submission",
                },
              },
            ],
          },
          Email: {
            email: email,
          },
          Role: {
            select: {
              name: selectedRole,
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return new Response(
        JSON.stringify({ error: "Failed to create page in Notion" }),
        {
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
