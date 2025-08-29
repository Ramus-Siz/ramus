/* fait un get ici: fetch("https://i.rubyx.io/v1/offers", {
  method: "GET",
  headers: {
    "Authorization": "Bearer eyJvcmciOiIxIiwiaWQiOiJhODc5ZjYxNThiOTc",
    "Content-Type": "application/json"
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
*/

export async function GET() {
    try {
        const response = await fetch("https://i.rubyx.io/v1/offers", {
            method: "GET",
            headers: {
                "Authorization": "Bearer eyJvcmciOiIxIiwiaWQiOiJhODc5ZjYxNThiOTc0OTEyYjE3ZDE2ZmJjOTBlMDc5OSIsImgiOiJtdXJtdXIxMjgifQ==",
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Error fetching RubyX offers:", error);
        return new Response("Error fetching RubyX offers", { status: 500 });
    }
}