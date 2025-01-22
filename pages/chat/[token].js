import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import ChatRoom from "../../components/index";

export default function Chat() {
  const router = useRouter();
  const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "this is a secret";
  const [done, setDone] = useState(false);
  const [username, setUsername] = useState("");
  const token = router.query.token;

  useEffect(() => {
    const verifyToken = async () => {
      if (!router.isReady) return;  // Wait until the router is ready

      if (!token) {
        router.push("/");  // Redirect to home if no token is present
        return;
      }

      try {
        // Verify JWT token
        const payload = jwt.verify(token, SECRET);

        // Fetch account based on the email from token
        const response = await fetch(
          `http://localhost:1337/api/accounts?filters[email][$eq]=${payload.email}`
        );

        // If the account doesn't exist, show an error
        const data = await response.json();
        if (!data.data || data.data.length === 0) {
          throw new Error("Account not found");
        }

        const account = data.data[0];

        // Verify if the token matches the one in the account
        if (token !== account.token) {
          throw new Error("Invalid token");
        }

        // Set username and mark the process as done
        setUsername(account.username);
        setDone(true);
      } catch (err) {
        console.error("Error verifying token:", err.message);
        router.push("/");  // Redirect on failure
      }
    };

    verifyToken();
  }, [router.isReady, token]);

  return (
    <div>
      {!done ? (
        <h1>Verifying token... Please wait</h1>
      ) : (
        <ChatRoom username={username} />
      )}
    </div>
  );
}
