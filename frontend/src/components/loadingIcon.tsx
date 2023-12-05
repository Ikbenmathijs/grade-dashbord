'use client'

export default function LoadingIcon({hidden}: {hidden: boolean | undefined}) {
    console.log(hidden);
    return (<>
    <div className="flex justify-center" hidden={hidden} >
        <img className={"animate-spin"} height={50} width={50} src="/icons/loading.svg" />  
        <p>{hidden}</p>
    </div>
    
    </>)
}