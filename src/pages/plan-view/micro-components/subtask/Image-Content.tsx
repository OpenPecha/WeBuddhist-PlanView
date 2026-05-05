
const ImageContent = ({ content }: { content: string }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-[#ECECEC] bg-white">
            <img
                src={content}
                alt=""
                className="w-full object-cover"
                loading="lazy"
            />
        </div>
    )
}

export default ImageContent