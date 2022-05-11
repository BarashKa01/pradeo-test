import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function User() {
    const { id } = useParams();
    //console.log(id);
    const [user, setUser] = useState([]);
    const [file, setFile] = useState();
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        fetch(`http://localhost:5000/user/${id}`)
            .then(response => response.json())
            .then((data) => {
                setUser(data);
                //console.log(data);
            })
            .catch((error) => console.log(error));
    };

    function handleFileChange(event) {
        event.preventDefault();
        if (event !== undefined && event !== null) {

            console.log(event.target);
            if (event.target.files.length > 0) {
                setFile(() => event.target.files[0]);
                setResponseMessage('');
            }
            console.log(file);
        }
    }

    function handleFormSubmit (event) {
        event.preventDefault();
        if (event !== undefined && event !== null) {
            
            //console.log(event.target.parentElement.children["android_app_input"]);
            let formData = new FormData();
            formData.set('file', file)
            formData.set('fileName', file.name);
            /*for (let p of formData) {
                console.log(p);
            }*/    
        
        //return;

        fetch(`http://localhost:5000/android-apps/create/${id}`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                setResponseMessage(data.comment);
            })
            .catch((error) => console.error(error));
        }
    }


    return (
        <div>
            <h1>Bienvenue {user.first_name}</h1>
            <Link to='/'>Accueil</Link>
            <div>
                <h2>Ajoutez une application</h2>
                <form>
                    <div>
                        <label htmlFor="android_app_input">Selectionnez un fichier (*.apk) :</label><br />
                        <input type="file" name="android_app_input" onChange={handleFileChange} />
                        <button type="submit" onClick={handleFormSubmit}>Envoyer</button>
                    </div>
                </form>
            </div>
            <div>
                <p>{responseMessage !== '' ? responseMessage : null}</p>
            </div>
            <Link to={`/user/${id}/secure-store`}>Mes applications</Link>
        </div>
    )
}

export default User;