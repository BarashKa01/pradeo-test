import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function AppStore() {

    const { id } = useParams();
    const [userApps, setUserApps] = useState([]);
    const [loading, setLoading] = useState('');
    useEffect(() => {
        fetchApp();
        setLoading('Loading...')
        return () => { };
    }, []);

    const fetchApp = () => {
        fetch(`http://localhost:5000/user/${id}/secure-store`).then(response => response.json())
            .then(
                data => {
                    console.log(data);
                    setUserApps(data);
                    setLoading('');
                })
            .catch(error => console.error(error));
    }



    return (
        <div>
            <Link to={`/user/${id}`}>Retour</Link>
            <h1>Liste de vos applications</h1>
            <h2>Selectionnez une application pour l'éditer</h2>
            <div>
                EDITION PART
            </div>
            <div>
                {loading !== '' ? <p>{loading}</p> :
                    userApps.map((app) => (
                        <div className='app-card' key={app.id}>
                            <p>{app.name}</p>
                            <p>{app.comment !== '' ? app.comment : 'Pas de commentaires'}</p>
                            <p>{app.is_safe ? "Application sûre" : "Application non fiable"}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default AppStore;