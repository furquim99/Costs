
import Message from '../layout/Message';
import Container from '../layout/Container';
import LinkButton from '../layout/LinkButton';
import Loading from '../layout/Loading';
import { useLocation } from "react-router-dom";

import styles from './Projects.module.css';
// import { useParams } from 'react-router-dom'; //pega o ":id" passado pela URL
import { useState, useEffect } from 'react';
import ProjectCard from '../project/ProjectCard';


// import {parse, v4 as uuidv4} from 'uuid';

function Projects(){
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false); // o estado de exibição no começo é falso pq o loader sempre vai iniciar, se for true ele vai tirar esse loader
    const [projectMessage, setProjectMessage] = useState('');

    const location = useLocation();
    let message = '';

    if(location.state){
        //essa "message" dentro de location vem do arquivo NewProject quando fazemos o navigate().
        message = location.state.message
    }

    useEffect(() => {
        //Esse timeout é apenas para o ícone de load demorar um pouqinho na tela.
        setTimeout(() => {
            fetch("http://localhost:5000/projects", { //http://localhost:8080/projetos/listar
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(resp => resp.json())
            .then(dataJson => {
                console.log(dataJson)
                setProjects(dataJson)

                setRemoveLoading(true); //"true" para remover o loading, pois ele sempre começa iniciando.

            })
            .catch(err => console.log("ERRO: ", err))
        }, 500);
    }, [])

    function removeProject(id){
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers:{
                'Content-type':'application/json'
            },
        })
        .then(resp => resp.json())
        .then(() =>{
            setProjects(projects.filter(p => p.id !== id)) //remove o projeto de mesmo id passado por request
            //message
            setProjectMessage('Projeto removido com sucesso!');
        })
        .catch(err => console.log("ERRO: ", err))
    }

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {
                message && <Message type="success" msg={message}  />
            }
            {
                projectMessage  && <Message type="success" msg={projectMessage}  />
            }
            <Container customClass="start">
                {
                    projects.length > 0 && projects.map((project) => (
                        <ProjectCard key={project.id}
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project?.category?.name}
                            handleRemove={removeProject}
                        />
                    ))
                }
                {/* !(Negação lógica) Retorna falso caso o único operando possa ser convertido para verdadeiro; senão, retorna verdadeiro. ex: var n1 = !true;   // !t retorna false */}
                {
                    !removeLoading && <Loading/> // coloca o loader
                }

                {
                    removeLoading && projects.length === 0 && (<p>Não ha projetos cadastrados</p>)
                }
            </Container>
        </div>
    )
}

export default Projects