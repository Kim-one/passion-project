import ComingSoon from "@/app/ComingSoon";

export default function EventsPage() {
    return (
        <ComingSoon
            eyebrow={'Coming Soon'}
            title={'Events'}
            icon={'celebration'}
            description={"From street festivals to beach parties and cultural showcases — soon you'll discover what's happening across all 14 parishes, right here."}
            features={[
                'Browse upcoming events by parish',
                'Filter by category and date',
                'Events hosted by local businesses',
                'Save events you want to attend',
            ]}
        />
    );
}
