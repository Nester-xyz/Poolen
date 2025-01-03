import { useSessionClient } from "../context/sessionContext";
import { useEffect, useState } from "react";
import { fetchAccount } from "@lens-protocol/client/actions";
import { client } from "../client";

interface LensProfile {
  metadata?: {
    picture?: {
      optimized?: {
        uri: string;
      };
    };
    displayName?: string;
  };
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Profile = () => {
  const [profile, setProfile] = useState<LensProfile | null>(null);
  const { loggedInUsername } = useSessionClient();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!loggedInUsername || !client) return;

      const result = await fetchAccount(client, {
        username: {
          localName: loggedInUsername
        },
      });

      if (result.isErr()) {
        console.error('Error fetching profile:', result.error);
        return;
      }

      setProfile(result.value);
    };

    fetchProfileData();
  }, [loggedInUsername]);

  const avatar = profile?.metadata?.picture?.optimized?.uri || DEFAULT_AVATAR;
  const userName = profile?.metadata?.displayName || loggedInUsername;

  return (
    <div className="flex items-center gap-3 p-4">
      <img
        src={avatar}
        alt=""
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="text-lg">@{userName}</div>
    </div>
  );
};

export default Profile;
