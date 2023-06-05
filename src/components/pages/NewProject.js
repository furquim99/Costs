import ProjectForm from '../project/ProjectForm'

import styles from './NewProjects.module.css'
import {useNavigate} from 'react-router-dom'


function NewProject(){
    // useNavigate: permitir fazer redirects nas páginas do sistema.
    const navigate = useNavigate();

    function createPost(project){ //idCategory

        //inicializar o cost e services
        project.cost = 0;
        project.services = []

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                'Content-type': "application/json",
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then(() => {
            navigate('/projects', { state: {message: 'Projeto criado com sucesso!'}} )
        })
        .catch(err => console.log("Error", err))

    }

    return(
        <div className={styles.newprojectContainer}>
            <h1>Criar projeto</h1>
            <p>Crie o seu projeto apra depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>
        </div>
    )
}

export default NewProject