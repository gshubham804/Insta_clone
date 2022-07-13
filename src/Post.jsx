import React,{useState,useEffect} from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';
import {db} from './firebase'
import firebase from 'firebase'


function Post({user,postId,username,imageUrl,caption}) {
  const [comments, setComments] = useState([]);
  const[comment, setComment]= useState('');

  useEffect(() => {
    let unsubscribe; 

    if (postId) {
      unsubscribe = db
        .collection("post")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) =>
              doc.data()))
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);


  const postComment =(e)=>{
    e.preventDefault();

    if (comment) {
      db.collection("post").doc(postId).collection("comments").add({
        username: user.displayName,
        text: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setComment("");
  }
  
  return (
    <div className='post'>
        <div className="post_header">
            <Avatar
            className="post_avatar"
            alt=""
            src="https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80"
            />
        <h3>{username}</h3>
        </div>
        {/* header+avatar+username*/}
<img className='post_image' src={imageUrl} alt="" />
        {/* image */}
<h4 className='post_text'><strong>{username}:</strong>{caption}</h4>
        {/* username + caption */}

        <div className="post_comments">
          {comments.map((comment)=>(
            <p>
              <strong>
                {comment.username}
              </strong>
              {comment.text}
            </p>
          ))}
        </div>

        {user && 
        <form className='post_commentbox'>
        <input
        className='post_input'
        type="text"
        placeholder='Add a comment...'
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
        />

        <button
        disabled={!comment}
        className='post_button'
        type="submit"
        onClick={postComment}>
          Post
        </button>
      </form>
        }
        
    </div>
  )
}

export default Post