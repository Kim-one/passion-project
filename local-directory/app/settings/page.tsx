import ComingSoon from "@/app/ComingSoon";

export default function SettingsPage() {
    return (
        <ComingSoon
            eyebrow={'Coming Soon'}
            title={'Account Settings'}
            icon={'settings'}
            description={"Fine-grained control over your account is on the way. For now, you can update your details from Edit Profile."}
            features={[
                'Manage email and password',
                'Notification preferences',
                'Privacy controls',
                'Delete your account',
            ]}
        />
    );
}
