'use client'

export default function LoadingIcon() {
    return (<>
    <div className="flex justify-center" >
        <img className={"animate-spin"} height={50} width={50} src="/icons/loading.svg" />  
    </div>
    
    </>)
}