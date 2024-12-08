import '../styles/skeleton_text.scss';

const Lines = (({ lines }) => {
    return <>
        {Array.from({ length: lines }).map((_, index) => {
            let randomWidth = `${Math.floor(Math.random() * (100 - 60 + 1)) + 60}%`;
            randomWidth = randomWidth
            return (
                <div
                    className="skeletonLine"
                    style={{
                        width: randomWidth,
                        animationDelay: `${index * 0.05}s`,
                    }}
                    key={index}
                ></div>
            );
        })}
    </>
})

const imgSize = 150

const SkeletonText = ({ lines = 3 }) => (
    <div className='skeletonTextContainer'>
        <div className="imgWithText">
            <div
                className="fakeImg"
                style={{
                    width: `${imgSize}px`,
                    height: `${imgSize}px`
                }}
            ></div>
            <div className="lines">
                <Lines lines={6} />
            </div>
        </div>
        <Lines lines={lines} />
    </div>
);

export default SkeletonText;
