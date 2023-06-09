import styles from './Input.module.css'

function Input ({type, text, name, placeholder, handleOnChange, value}){
    return(
        <div className={styles.formControl}>
            <label htmlFor={name}>{text}:</label>
            <input value={value} type={type} name={name} id={name} placeholder={placeholder} onChange={handleOnChange}></input>
        
        </div>
    )
}

export default Input