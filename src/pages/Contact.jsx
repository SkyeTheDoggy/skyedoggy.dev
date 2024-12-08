import HiddenEmail from "../components/HiddenEmail.jsx";
import { useEffect, useState } from "preact/hooks";

export default () => {
    const [animate, setAnimate] = useState(false);
    const emailBase64 = 'Y29udGFjdEBza3llZG9nZ3kuZGV2' // Base64 encoded to prevent bots from scraping emails for spam/scams

    useEffect(() => {
        const timeout = setTimeout(() => { setAnimate(true) }, 20)
        return () => {
            clearTimeout(timeout)
        }
    })
    
    return <div className={`contactContainer md introAnimated ${animate ? 'shown' : ''}`}>
        <section>
            <h2>Contact</h2>
            <p>
                If you have any questions or issues, feel free to email me at{" "}
                <HiddenEmail base64Email={emailBase64} />. I might take a bit longer to reply,
                but I’ll do my best to respond to as many messages as possible!
            </p>
            <p>
                <strong>TIP:</strong> Consider using <a href="https://proton.me" target="_blank" rel="noopener noreferrer">
                    ProtonMail
                </a> for secure, end-to-end encrypted communication. This is just a suggestion—I'm not sponsored or affiliated with ProtonMail.
            </p>
        </section>
    </div>
}