import constructionIcon from '../assets/icons/construction.svg'

export default () => { 
    return (
        <div className="WIPContainer">
            <img draggable={false} className='WIPIcon' src={constructionIcon} alt="WIP" />
            <span>This page is a work in progress...</span>
            <a href="/">Go home</a>
        </div>
    )
}