import { Link } from 'react-router-dom';
import styles from './LinkButton.module.css'


// to = para onde vei o link que vc vai clicar, ou seja, mudar a url dinamicamente
// text= baseado daonde o texto vai ser utilizado, ou seja, mudar o texto dinamicamente
function LinkButton ({to, text}) {
    return(
        <Link className={styles.btn} to={to}> 
            {text}
        </Link>
    )
}

export default LinkButton