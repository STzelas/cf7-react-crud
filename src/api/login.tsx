
export type LoginFields = {
  username: string,
  password: string,
}

export type LoginResponse = {
  access_token: string,

}

export async function login ({username, password}: LoginFields):Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(import.meta.env.VITE_API_URL + "/login/access-token",
    {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    body: form.toString()
    }
  );
  if (!res.ok) {
    let detail = "Login failed.";
    try {
      const data = await res.json()
      if (typeof data?.detail === "string") detail = data.detail
    } catch (err) {
      console.error(err);
    }
    throw new Error(detail);
  }
  return await res.json();
}