import findInPageIcon from '../assets/icons/find_in_page.svg'

export default () => {
    return (
        <div className='notFoundContainer'>
            <img draggable={false} className='notFoundIcon' src={findInPageIcon} alt="not found" />
            <span>Page Not Found</span>
            <a href="/">Go home</a>
        </div>
    )
}