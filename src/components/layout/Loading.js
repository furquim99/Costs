import styles from './Loading.module.css'
import loading from '../../img/loading.svg';

function Loading()  {
    return(
        <div className={styles.loaderContainer}>
            <img src={loading} alt="loading" className={styles.loader}></img>
        </div>
    )
}

export default Loading