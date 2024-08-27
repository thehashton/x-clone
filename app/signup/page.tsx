"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import styles from "./Signup.module.scss";
import { PiXLogoBold } from "react-icons/pi";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>(""); // Success message
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!email || !password || !fullName || !username) {
      setError("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError(""); // Clear previous errors
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update user's display name
      await updateProfile(user, {
        displayName: fullName,
      });

      // Save the username and additional info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email: user.email,
        createdAt: new Date(),
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000); // Redirect after 2 seconds
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else {
        setError("Failed to create an account. Please try again.");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.logoContainer}>
        <PiXLogoBold className={styles.logo} />
      </div>
      <h1 className={styles.title}>Join X today</h1>
      <form onSubmit={handleSignUp} className={styles.form}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Create account"}
        </button>
      </form>
      <p className={styles.footerText}>
        By signing up, you agree to the{" "}
        <a href="#" className={styles.link}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className={styles.link}>
          Privacy Policy
        </a>
        , including{" "}
        <a href="#" className={styles.link}>
          Cookie Use
        </a>
        .
      </p>
      <p className={styles.footerText}>
        Have an account already?{" "}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </p>
    </div>
  );
}
