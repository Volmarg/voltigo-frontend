import 'cookieconsent/src/cookieconsent';
import 'cookieconsent/src/styles/themes/classic.css';
import 'cookieconsent/src/styles/base.css';
import 'cookieconsent/src/styles/animation.css';
import 'cookieconsent/src/styles/layout.css';
import 'cookieconsent/src/styles/media.css';

/**
 * Based on {@link https://www.npmjs.com/package/cookieconsent}
 *
 * Documentation:
 * - {@link https://www.osano.com/cookieconsent/documentation/javascript-api/}
 */
export default class CookiePopup {

    public static initialise(): void {

        let message = `
            <b>Annoying cookies popup</b>
            </br></br>
            We are literally forced to show You this cookie message. We don't like it either. 
            </br></br>
            If You use our website then we state that You accept the Cookies policy.
        `
        // @ts-ignore
        window.cookieconsent.initialise({
            container: document.getElementById("content"),
            content: {
                message: message,
                dismiss: "Ok",
                href: 'https://www.cookielaw.org/the-cookie-law/'
            },
            palette: {
                popup: {
                    background: "#237afc"
                },
                button: {
                    background: "#fff",
                    text: "#237afc"
                }
            },
            theme: "classic",
            position: "bottom-right"
        });
    }

}