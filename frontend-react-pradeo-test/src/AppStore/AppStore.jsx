import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppComponent from './AppComponent';

function AppStore() {

    const { id } = useParams();
    const [userApps, setUserApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appListError, setAppListError] = useState(false);
    const appList = userApps.map(app => <AppComponent key={app.id} app={app} />);


    useEffect(() => {
        setLoading(true);
        const intervalFetch = setInterval(() => {
            fetchUserApps();
        }, 2000);

        return () => {
            clearInterval(intervalFetch);
        }
    }, []);

    /*
        //Create stream for SSE ***NOT WORKING :(***
        useEffect(() => {
            const eventSource = new EventSource('http://localhost:5000/android-apps/app-updated');
            console.log("EVENT SOURCE TRIGGER");
            eventSource.onmessage = ({ data }) => {
                console.log('New message', JSON.parse(data));
                //setUserApps({...userApps, data});
            };
            return () => {
                return (eventSource) => {
                    eventSource.close()
                }
            };
        }, []);
    */

    const fetchUserApps = () => {
        fetch(`http://localhost:5000/user/${id}/secure-store`).then(response => response.json())
            .then(
                data => {
                    setUserApps(data);
                    setLoading(false);
                    setAppListError(false);
                })
            .catch(() => {
                setAppListError(true);
            });
    }

    return (
        <div>
            <Link to={`/user/${id}`}>Retour</Link>
            <h1>Liste de vos applications</h1>
            <div>
                {
                loading ? <p>Chargement...</p> : 
                userApps.length === 0 ? <p>No applications in the library, try to refresh or upload application</p> : 
                appList
                }
                {
                    appListError ? <p>Something went wrong while fetching applications, please wait</p> : null
                }
            </div>
        </div>
    )
}

export default AppStore;