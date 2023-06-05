import { useState, useEffect } from 'react'

import styles from './ProjectForm.module.css'
import Input from '../form/input'
import Select from '../form/Select'
import Submit from '../form/Submit'

function ProjectForm ({handleSubmit, projectData, btnText}) {

    const [categories, setCategories] = useState([]);
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((resp) => resp.json())
            .then((dataJson) => {
                setCategories(dataJson);
            })
            .catch(err => console.log("ERRO: ", err))
    }, [])

    const submit = (e) =>{
        e.preventDefault();
        handleSubmit(project);
        console.log('Submit',project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name] : e.target.value})
        console.log('handleChange', project)
        /*
            Pega os dados do projeto até então por "...project"
            Informa que o "name" do input (name/budget) será igual ao "e.target.value"

            Isso quer dizer que, independente do input a ser preenchido, mudará a propriedade da variavel "project"
        */
    }

    function handleCategory(e){
        setProject({
            ...project,
            category:{
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
            },
        })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" 
                text="Nome do projeto"
                name="name"
                placeholder="Insira o nome do projeto"
                handleOnChange={handleChange}
                value={project.name ? project.name : ''}
                />
            <Input 
                type="number" 
                text="Orçamento do projeto"
                name="budget"
                placeholder="Insira o orçamento total"
                handleOnChange={handleChange}
                value={project.budget ? project.budget : ''}
                />
            <Select
                name='category_id'
                text="Selecione uma categoria"
                options={categories}
                handleOnChange={handleCategory}
                value={project.category ? project.category.id : ''}
                />
            <Submit text={btnText}/>   
        </form>
    )
}

export default ProjectForm