const MobileView = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="md:top-[5rem] fixed w-full md:w-auto inset-0 flex md:items-end justify-end pe-4 md:pe-0
                md:justify-end right-4 bottom-[130px] md:bottom-[170px]">
            <div className="bg-black w-[90%] max-w-[350px] md:max-w-[300px] h-[100%] md:mb-0
                mt-[10px] md:max-h-[630px] rounded-2xl overflow-y-auto scrollbar-none shadow-xl flex flex-col">
                <div className="flex-1  p-4">{children}</div>
            </div>
        </div>
    );
};
export default MobileView