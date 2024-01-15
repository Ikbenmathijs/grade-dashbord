

export default function ExpandButton({onPressed, height, width}: {onPressed: Function; height?: number; width?: number}) {

    return (<img src="/icons/expand.svg" height={height ? height : 50} width={width ? width : 50} />)
}