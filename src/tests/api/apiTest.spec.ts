import { expect, test } from "../../fixtures/base_fixture";

test("test api", async({ request }) => {
    const res = await request.get("/objects");
    expect(res.status()).toBe(200);
    const responseBody = await res.json();
    console.log(responseBody);
});