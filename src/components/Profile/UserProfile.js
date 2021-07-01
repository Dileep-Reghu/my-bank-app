import {useState} from 'react';
import ProfileForm from "./ProfileForm";
import classes from "./UserProfile.module.css";
import ProfileTitleBar from "../Profile/ProfileTitleBar";
const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const editHandler = (status) =>{
    setIsEditing(status);
  }
  return (
    <div className={classes.profile}>
      <ProfileTitleBar isEditing = {isEditing} title="User Profile" updateEditStatus={editHandler}/>
      <ProfileForm isEditing = {isEditing} updateEditStatus={editHandler}/>
    </div>
  );
};

export default UserProfile;
