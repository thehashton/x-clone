import { useState } from "react";
import {
  FaRegComment,
  FaRetweet,
  FaRegHeart,
  FaShare,
  FaHeart,
  FaChartBar,
  FaTrashAlt, // Import Trash icon for delete
  FaThumbtack, // Import Pin icon for pin/unpin
  FaListAlt, // Import List icon for add/remove from Highlights
  FaReply, // Import Reply icon for change who can reply
  FaSignal, // Import Engagement icon for view engagements
  FaExternalLinkAlt, // Import Embed icon for embed post
} from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { PiSealCheckFill } from "react-icons/pi";
import styles from "./Tweet.module.scss";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface TweetProps {
  tweetId: string;
  avatarUrl: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  comments: number;
  retweets: number;
  likes: number;
  onDelete: () => void;
}

export default function Tweet({
  tweetId,
  avatarUrl,
  name,
  handle,
  time,
  content,
  comments,
  retweets,
  likes,
  onDelete,
}: TweetProps) {
  const [commentCount, setCommentCount] = useState(comments);
  const [retweetCount, setRetweetCount] = useState(retweets);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [impressions] = useState<number>(
    Math.floor(Math.random() * (5000000 - 1000 + 1)) + 1000,
  ); // Randomize impressions

  const handleMenuToggle = () => setShowMenu(!showMenu);

  const handleLike = async () => {
    const newLikeCount = likeCount + 1;
    setIsLiked(!isLiked);
    setLikeCount(newLikeCount);

    try {
      const tweetRef = doc(db, "tweets", tweetId);
      await updateDoc(tweetRef, {
        likes: newLikeCount,
      });
    } catch (error) {
      console.error("Failed to update likes:", error);
    }
  };

  const handleRetweet = async () => {
    const newRetweetCount = retweetCount + 1;
    setRetweetCount(newRetweetCount);

    try {
      const tweetRef = doc(db, "tweets", tweetId);
      await updateDoc(tweetRef, {
        retweets: newRetweetCount,
      });
    } catch (error) {
      console.error("Failed to update retweets:", error);
    }
  };

  const handleComment = async () => {
    const newCommentCount = commentCount + 1;
    setCommentCount(newCommentCount);

    try {
      const tweetRef = doc(db, "tweets", tweetId);
      await updateDoc(tweetRef, {
        comments: newCommentCount,
      });
    } catch (error) {
      console.error("Failed to update comments:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const tweetRef = doc(db, "tweets", tweetId);
      await deleteDoc(tweetRef); // Delete the tweet from Firebase
      onDelete(tweetId); // Pass the tweet ID to the parent component to remove it from state
    } catch (error) {
      console.error("Failed to delete tweet:", error);
    }
  };

  return (
    <div className={styles.tweet}>
      <img src={avatarUrl} alt={`${name}'s avatar`} className={styles.avatar} />
      <div className={styles.tweetContent}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          <span className={styles.handle}>
            @{handle} <PiSealCheckFill className={styles.verifiedIcon} />
          </span>
          <span className={styles.time}> · {time}</span>
          <FiMoreHorizontal
            className={styles.moreIcon}
            onClick={handleMenuToggle}
          />
          {showMenu && (
            <div className={styles.menu}>
              <div
                onClick={handleDelete}
                className={`${styles.menuItem} ${styles.redMenuItem}`}
              >
                <FaTrashAlt className={styles.menuIcon} /> Delete
              </div>
              <div className={styles.menuItem}>
                <FaThumbtack className={styles.menuIcon} /> Unpin from profile
              </div>
              <div className={styles.menuItem}>
                <FaListAlt className={styles.menuIcon} /> Add/remove from
                Highlights
              </div>
              <div className={styles.menuItem}>
                <FaListAlt className={styles.menuIcon} /> Add/remove @{handle}{" "}
                from Lists
              </div>
              <div className={styles.menuItem}>
                <FaReply className={styles.menuIcon} /> Change who can reply
              </div>
              <div className={styles.menuItem}>
                <FaSignal className={styles.menuIcon} /> View post engagements
              </div>
              <div className={styles.menuItem}>
                <FaExternalLinkAlt className={styles.menuIcon} /> Embed post
              </div>
              <div className={styles.menuItem}>
                <FaSignal className={styles.menuIcon} /> View post analytics
              </div>
              <div className={styles.menuItem}>
                <FaSignal className={styles.menuIcon} /> Request Community Note
              </div>
            </div>
          )}
        </div>
        <div className={styles.body}>
          <p>{content}</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.action} onClick={handleComment}>
            <FaRegComment className={styles.icon} />
            <span>{commentCount}</span>
          </div>
          <div className={styles.action} onClick={handleRetweet}>
            <FaRetweet className={styles.icon} />
            <span>{retweetCount}</span>
          </div>
          <div className={styles.action} onClick={handleLike}>
            {isLiked ? (
              <FaHeart className={`${styles.icon} ${styles.liked}`} />
            ) : (
              <FaRegHeart className={styles.icon} />
            )}
            <span>{likeCount}</span>
          </div>
          <div className={styles.action}>
            <FaChartBar className={styles.icon} />
            <span>{impressions.toLocaleString()}</span>
          </div>
          <div className={styles.action}>
            <FaShare className={styles.icon} />
          </div>
        </div>
      </div>
    </div>
  );
}
