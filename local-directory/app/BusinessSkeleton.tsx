const BusinessSkeleton = () => {
    return (
        <div className="bg-charcoal h-screen flex flex-col items-center animate-pulse">
            <div className="flex flex-col items-center py-10 px-80 gap-4">
                <div className="h-4 w-40 bg-gray-700 rounded" />
                <div className="h-12 w-80 bg-gray-700 rounded" />
                <div className="h-20 w-[600px] bg-gray-700 rounded" />
            </div>
            <div className="bg-[#1e1e1e] w-[800px] h-[600px] rounded-2xl p-10 border border-gray-800">
                <div className="flex justify-between mb-8">
                    <div className="h-12 w-[350px] bg-gray-700 rounded-3xl" />
                    <div className="h-12 w-[350px] bg-gray-700 rounded-3xl" />
                </div>
                <div className="h-40 w-full bg-gray-700 rounded-3xl mb-8" />
                <div className="h-12 w-full bg-gray-700 rounded-3xl" />
            </div>
        </div>
    )
}

export default BusinessSkeleton;