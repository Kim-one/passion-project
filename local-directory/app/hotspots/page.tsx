import ComingSoon from "@/app/ComingSoon";

export default function HotspotsPage() {
    return (
        <ComingSoon
            eyebrow={'Coming Soon'}
            title={'Hotspots'}
            icon={'local_fire_department'}
            description={"The most talked-about, highly-rated and trending places on the island — curated into can't-miss hotspots. We're putting the finishing touches on it."}
            features={[
                'Trending spots this week',
                'Top-rated by the community',
                'Hidden gems off the beaten path',
                'Curated by parish and vibe',
            ]}
        />
    );
}
