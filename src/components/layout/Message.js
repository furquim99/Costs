import styles from './Message.module.css';

import { useState, useEffect } from 'react';

function Message({type, msg}){

    const [visible, setVisible] = useState(false);// nao começa exibindo por isso colocamos false

    useEffect(() => {
        if(!msg){ // nao tem mensagem, nao vou exibir nada
            setVisible(false);
            return;
        }
        setVisible(true);// se tiver eu inicio a mensagem
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000)
        return () => clearTimeout(timer)
    }, [msg]) //useEffect sempre deve estar ligado à alguem. Nesse caso, ele esta ligado à msg
    
    return(
        <>
            {
                visible && (
                    <div className={`${styles.boxMessage} ${styles[type]}`}>
                        {msg}
                    </div>
                )
            }
        </>
    )
}

export default Message