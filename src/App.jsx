import './App.css';
import Post from './Post';
import React, {useState,useEffect} from 'react'
import { db,auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import {makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input'
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle(){
  const top =50;
  const left =50;


return {
  top:`${top}%`,
  left:`${left}%`,
  transform:`translated(-${top}%,-${left}%)`,
};
}

const useStyles = makeStyles((theme)=>({
  paper:{
  position:'absolute',
  width:400,
  backgroundColor:theme.palette.background.paper,
  border:'2px solid #000',
  boxShadow:theme.shadows[5],
  padding:theme.spacing(2,4,3),
  },
}))

function App() {
  const classes = useStyles();
  const[modalStyle] = useState(getModalStyle);
  const[posts,setPosts] = useState([]);
  const[open,setOpen] = useState(false);
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState("");
  const[username,setUserName] = useState("");
  const[user,setUser]=useState('');
  const[openSignIn,setOpenSignIn]=useState(false);
  // {
  //   username:"shubh gupta",
  //   caption:"If we think, then we deserve",
  //   imageUrl:"https://images.unsplash.com/photo-1575367088419-77bd052a7375?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
  // }

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user has logged in...
        console.log(authUser);
        setUser(authUser); 

      }else{
        //user has logged out...
        setUser(null);
      }
    })
 
    return()=>{
      //perform some cleanup actions
      unsubscribe();
    }
  },[user,username]);

useEffect(() => {
  //this is where code runs
  db.collection("post").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc =>({
      id:doc.id,
      post:doc.data()
    })));
  })
},[]) 


const signUp = (event)=>{
  event.preventDefault();
  
  auth
  .createUserWithEmailAndPassword(email, password)
  .then((authUser)=>{
   return authUser.user.updateProfile({
      displayName:username,
    })
  })
  .catch((error)=>
  alert(error.message));
}

const signIn =(event)=>{
  event.preventDefault();

  auth.signInWithEmailAndPassword(email,password)
  .catch((error)=>alert(error.message))

  setOpenSignIn(false);
}

  return (
    <div className="App">
   
      <Modal open={open}
      onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} 
        className={classes.paper}>
<form className="app_signup">
          <center>
          <img className='app_headerImage'
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt=""
      />
      </center>
      <Input
      placeholder="Username"
      type="text"
      value={username}
      onChange={(e)=>setUserName(e.target.value)}
      />
      <Input
      placeholder="Email"
      type="text"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />

      <Input
      placeholder="Password"
      type="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />
<Button type="submit" onClick={signUp}>Sign Up</Button>
</form>
        </div>

      </Modal>

      <Modal open={openSignIn}
      onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} 
        className={classes.paper}>
<form className="app_signup">
          <center>
          <img className='app_headerImage'
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt=""
      />
      </center>
      <Input
      placeholder="Email"
      type="text"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />

      <Input
      placeholder="Password"
      type="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />
<Button type="submit" onClick={signIn}>Sign In</Button>
</form>
        </div>

      </Modal>
      {/* header */}

      <div className="app_header">
        <img className='app_headerImage'
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt=""
    />
    {user?(
<Button onClick={()=>auth.signOut()}>Logout</Button>
      ):(
        <div className="app_loginContainer">
<Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
<Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
      )}
      </div>

      
      {/* post */}

      <div className="app_posts">
        <div className="app_postsleft">
        {
        posts.map(({id,post})=>(
        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        )) 
      }
        </div>
      
      <div className="app_postright">
      </div>
      </div>

  

{user?.displayName ? (
<ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry you need to login to upload</h3>
      )}

    </div>
  );
}

export default App;
