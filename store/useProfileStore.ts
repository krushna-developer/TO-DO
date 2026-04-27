import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Profile {
    name: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    bio: string;
    avatarUrl: string;
}

interface ProfileStore {
    profile: Profile;
    isSaved: boolean;
    updateProfile: (data: Partial<Profile>) => void;
    updateAvatar: (url: string) => void;
    setIsSaved: (val: boolean) => void;
}

const defaultProfile: Profile = {
    name: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    bio: "",
    avatarUrl: "",
};

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set) => ({
            profile: defaultProfile,
            isSaved: false,

            updateProfile: (data) =>
                set((state) => ({
                    profile: { ...state.profile, ...data },
                })),

            updateAvatar: (url) =>
                set((state) => ({
                    profile: { ...state.profile, avatarUrl: url },
                })),

            setIsSaved: (val) => set({ isSaved: val }),
        }),
        { name: "profile-store" }
    )
);