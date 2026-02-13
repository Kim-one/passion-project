
export default function loginPage () {
    return (
        <div className={'flex flex-row h-[500px] w-[900px] bg-background'}>
            <div className={'w-[450px]'}>
                <img src={'/images/pool.webp'} alt={'Pool'} className={'h-full w-full'}/>
            </div>
            <div className={'flex justify-center items-center'}>
                <div className={'flex flex-col justify-center p-[20px]'}>
                    <h1 className={'text-yellow-300 text-2xl'}>Join the local 876 Explore Community</h1>
                    <p className={'text-white'}>Connect with local businesses and island favorites</p>
                    <div className={'bg-charcoal rounded-full w-[400px] h-9'}>
                        <button className={'bg-checked rounded-full text-white'}>Login</button>
                        <button className={'bg-checked rounded-full text-white'}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}