// customizable success message with callback function, which is pretty much the error message but with different colors
export default function SuccessMessage ({title, desc, hidden, setHiddenCallback, okButtonCallback}: {title: string; desc: string, hidden:boolean | undefined, setHiddenCallback: Function, okButtonCallback?: Function}) {



    function okButtonClicked() {
        setHiddenCallback(true);
        if (okButtonCallback) okButtonCallback();
    }


    return (<>
        <div hidden={hidden}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
                <div className="relative w-full h-full">
                    <div className="relative bg-white rounded-lg shadow-2xl shadow-slate-700 backdrop-grayscale">
                        <div className="p-6 text-center">
                            <div className="text-teal-600 font-medium text-xl">{title}</div>
                            <div className="mb-5 text-lg font-normal text-gray-500">{desc}</div>
                            <button className="text-white bg-teal-500 hover:bg-teal-700 hover:shadow-inner font-medium rounded-lg text-sm items-center px-5 py-2.5 text-center mr-2" onClick={okButtonClicked}>Oké.</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}