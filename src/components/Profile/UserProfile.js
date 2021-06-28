import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';
import TitleBar from "../Layout/TitleBar";
const UserProfile = () => {
  return (
    <section className={classes.profile}>
      <TitleBar title="User Profile" />
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
