import { useState } from "preact/hooks";

export default ({ base64Email }) => {
    const [visible, setVisible] = useState(false);
    const [decodedEmail, setDecodedEmail] = useState('user@example.com');

    const makeVisible = () => {
        setDecodedEmail(atob(base64Email))
        setVisible(true)
    }

    const splited = atob(base64Email).split('@')
    const username = shuffleString(splited[0])
    const splitDomain = splited[1].split('.')
    const domainName = shuffleString(splitDomain[0])
    const topLevelDomain = shuffleString(splitDomain[1])
    let shuffledEmail = `${username}@${domainName}.${topLevelDomain}`


    if (!visible) return (
        <span onClick={makeVisible} className="fakeEmail">
            {shuffledEmail}
        </span>
    )

    return <a className='email' target="_blank" rel="noopener noreferrer" href={`mailto:${decodedEmail}`}>{decodedEmail}</a>
}

const random = (max) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % (max + 1);
}

function shuffleString(str) {
    let arr = str.split('');
    let original = str;

    do {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(random(i));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    } while (arr.join('') === original);

    return arr.join('');
}