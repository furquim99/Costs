import styles from './Project.module.css';
import { useParams } from 'react-router-dom'; //pega o ":id" passado pela URL
import { useState, useEffect } from 'react';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';
import {parse, v4 as uuidv4} from 'uuid';

function Project (){

    const {id} = useParams(); //coloca o id dessa maneira para o React entender que o id vem da URL.
    //console.log(id)
    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);

    const [showProject, setShowProject] = useState(false); //não exibe inicialemnte o formulário do projeto, e sim exibe os dados do projeto primeiro.
    const [showService, setShowService] = useState(false);

    const [message, setMessage] = useState('');
    const [type, setType] = useState();

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
            })
            .then(resp => resp.json())
            .then(dataJson => {
                setProject(dataJson)

                setServices(dataJson.services)
            })
            .catch(err => console.log("ERRO: ", err))
        }, 300);


    }, [id]) //o useEffect está monitorando o "id" do projeto como referencia.

    function editPost(project){
        setMessage('')
         //budget validation
        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto!');
            setType('error');
            return false; // vai para tudo pq nao é possivel mexer no projeto 
        }
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(dataJson => {
            setProject(dataJson)

            setShowProject(false) // esconder esse formularip ja que eu terminei a edição

            setMessage('Projeto atualizado!')
            setType('success')
        })
        .catch(err => console.log("ERRO: ", err))
    }

    function createService(project){
        setMessage('')

        //validacao
        const uService = project.services[project.services.length -1];
        //pega o ultimo servico que acabou de adicionar.
        uService.id = uuidv4()
        //fornece um id unico para o ultimo service, pois será preciso imprimir na tela e o React pede uma chave key.
        
        const uServiceCost = uService.cost;
        const nCost = parseFloat(project.cost) + parseFloat(uServiceCost);
        // nCost = custo atual do projeto + ultimo custo do projeto

        //validacao do valor maximo

        if(nCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado! Verifique o valor do serviço.');
            setType('error');
            project.services.pop(); 
            return false;
        }

        //add service cost to project total cost
        project.cost = nCost;

        //update do projeto
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(dataJson => {
            setShowService(false)
        })
        .catch(err => console.log("ERRO: ", err))
    }

    function removeService(id, cost){

        const serviceUp = project.services.filter(service => service.id !== id)
        //tira o serviço que tem o "id" igual ao que foi passado por parametro. Ficará apenas os serviços com IDs diferentes do que foi passado por parametro, que seria o removivel.
        const projectUp = project
        projectUp.services = serviceUp
        projectUp.cost = parseFloat(projectUp.cost) - parseFloat(cost)
        // parseFloat analisa um argumento (convertendo-o para uma string primeiro caso necessário) e retorna um número de ponto flutuante (número decimal)

        //Atualizar na base de dados
        fetch(`http://localhost:5000/projects/${projectUp.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUp)
        })
        .then(resp => resp.json())
        .then(dataJson => {
            setProject(projectUp)
            setServices(serviceUp)
            setMessage('Serviço removido com sucesso!')
            setType('success')
        })
        .catch(err => console.log("ERRO: ", err))
    }

    function toggleProject(){
        setShowProject(!showProject)
    }
    function toggleService(){
        setShowService(!showService)
    }

    return(
        <>
            {project.name ? (
                <div className={styles.projectDetails}>
                    <Container customClass="column">

                        {
                            message && <Message type={type} msg={message} />
                        }

                        <div className={styles.detailsContainer}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProject}>
                                {/* SE NAO TIVER SHOW PROJECT EXIBIDO, MOSTRA Editar projeto, SENAO MOSTRE FECHAR */}
                                {!showProject ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProject ? (
                                <div className={styles.projectInfo}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado: </span> R${project.cost}
                                    </p>
                                </div>
                            ) : 
                            (
                                <div className={styles.projectInfo} >
                                    <ProjectForm handleSubmit={editPost}
                                         btnText="Concluir edição"
                                         projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.serviceContainer}>
                            <h2>Adicione um serviço: </h2>
                            <button className={styles.btn} onClick={toggleService}>
                                {!showService ? 'Adicionar serviço' : 'Fechar'}
                            </button>

                            <div className={styles.projectInfo}>
                                {
                                    showService && (
                                        <ServiceForm
                                            btnText="Adicionar Serviço"
                                            handleSubmit={createService}
                                            projectData={project}
                                        />
                                    )
                                }
                            </div>
                        </div>


                        <h2 className={styles.equal}>Serviços</h2>
                        <Container customClass="start">
                            {
                                services.length > 0 &&
                                services.map(service => (
                                    <ServiceCard key={service.id}
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {
                                services.length === 0 &&
                                <p>Não há serviços cadastrados. </p>
                            }
                        </Container>
                    </Container>
                </div>
            ): (
                <Loading/>
            ) }
        </>
    )
}

export default Project