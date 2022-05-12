import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function AppStore() {

    const { id } = useParams();
    const [userApps, setUserApps] = useState([]);
    const [loading, setLoading] = useState('');

    useEffect(() => {
        fetchApp();
        return ((eventSource) => {eventSource.close()})
    }, []);

    const fetchApp = () => {
        setLoading('Loading...');
        fetch(`http://localhost:5000/user/${id}/secure-store`).then(response => response.json())
            .then(
                data => {
                    //console.log(data);
                    setUserApps(data);
                    setLoading('');
                })
            .catch(error => console.error(error));
    }

    const listenToAppUpdate = () => {

    }
    const eventSource = new EventSource('http://localhost:5000/android-apps/app-updated');
    console.log("EVENT SOURCE TRIGGER");
    eventSource.onmessage = ({ data }) => {
        console.log('New message', JSON.parse(data));
        //setUserApps({...userApps, data});
    };


    const getAppStatus = (application) => {
        if (application.is_verified) {
            if (application.is_safe) {
                return "Sûre 👍";
            } else {
                return "Virus 🦟";
            }
        } else {
            return "En cours de vérification 🥁";
        }
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
                            <p>{getAppStatus(app)}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default AppStore;