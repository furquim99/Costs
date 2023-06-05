import styles from './Select.module.css'

function Select ({ text, name, handleOnChange, options, value}){
    return(
        <div className={styles.selectControl}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name} onChange={handleOnChange} value={value || ''}>
                <option>Selecione uma opção</option>
                {
                    options.map((op) => (
                        <option value={op.id} key={op.id}>{op.name}</option>
                    ))
                }
            </select>
            
        </div>
    )
}

export default Select