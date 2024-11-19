import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

interface ProfileData {
  displayName?: string;
  photoURL?: string;
}

const updateProfile = async (profileData: ProfileData) => {
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, profileData);
  }
};

export default updateProfile;