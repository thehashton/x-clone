"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import {
  FaImage,
  FaSmile,
  FaPoll,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBold,
  FaItalic,
  FaUserCircle, // Import the user icon
} from "react-icons/fa";
import styles from "./MainContent.module.scss";
import Tweet from "@/components/Tweet";
import { useAuth } from "@/context/AuthContext";

export default function MainContent() {
  const [tweets, setTweets] = useState<any[]>([]);
  const [newTweet, setNewTweet] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState("For you");
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { user } = useAuth();

  // If user is logged in, use their avatar. Otherwise, use the FaUserCircle icon.
  const avatarUrl = user
    ? "https://randomuser.me/api/portraits/men/9.jpg" // Specific avatar URL for logged-in user
    : null; // No URL when user is not logged in

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const tweetsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const date = new Date(
            data.createdAt.seconds * 1000 +
              data.createdAt.nanoseconds / 1000000,
          );

          return {
            id: doc.id,
            ...data,
            time: date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          };
        });
        setTweets(tweetsData);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFullName(data.fullName);
          setUsername(data.username);
        }
      }
    };

    fetchTweets();
    fetchUserData();
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newTweet.trim().length > 1 && user) {
      try {
        setIsSubmitting(true);
        const tweetData = {
          content: newTweet,
          userId: user.uid,
          createdAt: new Date(),
        };
        const docRef = await addDoc(collection(db, "tweets"), tweetData);
        const date = new Date();
        const newTweetData = {
          id: docRef.id,
          ...tweetData,
          time: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
        setTweets([newTweetData, ...tweets]);
        setNewTweet("");
      } catch (error) {
        console.error("Error submitting tweet:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Tweet not submitted. Missing content or user.");
    }
  };

  const handleDeleteTweet = (tweetId: string) => {
    setTweets((prevTweets) =>
      prevTweets.filter((tweet) => tweet.id !== tweetId),
    );
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.topMenu}>
        {[
          "For you",
          "Following",
          "CSS",
          "TypeScript",
          "Design Engineers — Frontend",
        ].map((menu) => (
          <button
            key={menu}
            className={`${styles.menuItem} ${
              activeMenu === menu ? styles.active : ""
            }`}
            onClick={() => handleMenuClick(menu)}
          >
            {menu}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.tweetInput}>
        <div className={styles.inputContainer}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="User" className={styles.profileImage} />
          ) : (
            <FaUserCircle className={styles.profileIcon} /> // Use the icon if user is not logged in
          )}
          <textarea
            placeholder="What is happening?!"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.iconsContainer}>
          <FaImage className={styles.icon} />
          <FaSmile className={styles.icon} />
          <FaPoll className={styles.icon} />
          <FaCalendarAlt className={styles.icon} />
          <FaMapMarkerAlt className={styles.icon} />
          <FaBold className={styles.icon} />
          <FaItalic className={styles.icon} />
          <button
            type="submit"
            className={styles.postButton}
            disabled={isSubmitting || newTweet.trim().length <= 1} // Disable if not typing
          >
            {isSubmitting ? "Submitting..." : "Post"}
          </button>
        </div>
      </form>
      <div className={styles.showPosts}>Show 105 posts</div>
      <div className={styles.feed}>
        {user ? (
          tweets.map((tweet) => (
            <div key={tweet.id} className={styles.tweet}>
              <Tweet
                tweetId={tweet.id}
                avatarUrl={avatarUrl || ""}
                name={fullName}
                handle={username}
                time={tweet.time}
                content={tweet.content}
                comments={tweet.comments}
                retweets={tweet.retweets}
                likes={tweet.likes}
                onDelete={handleDeleteTweet} // Pass the handler function here
              />
            </div>
          ))
        ) : (
          <p className={styles.loginMessage}>Please log in to tweet.</p>
        )}
      </div>
    </div>
  );
}
