import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function User() {
    const { id } = useParams();
    const [user, setUser] = useState([]);
    const [file, setFile] = useState();
    const [responseUserError, setResponseUserError] = useState(false);
    const [responseFileError, setResponseFileError] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        fetch(`http://localhost:5000/user/${id}`)
            .then(response => response.json())
            .then((data) => {
                setUser(data);
                setResponseUserError(false);
            })
            .catch(() => {
                setUser([]);
                setResponseUserError(true);
            });
    };

    function handleFileChange(event) {
        event.preventDefault();

        if (event !== undefined && event !== null) {

            console.log(event.target);
            if (event.target.files.length > 0) {
                setFile(() => event.target.files[0]);
            }
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        if (event !== undefined && event !== null) {

            let formData = new FormData();

            formData.set('file', file)
            formData.set('fileName', file.name);

            fetch(`http://localhost:5000/android-apps/create/${id}`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(() => {
                    setResponseFileError(false);
                })
                .catch(() => {
                    setResponseFileError(true);
                });
        }
    }

    return (
        <div>
            {responseUserError ? <p>User can't be found</p> :
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
                        {responseFileError ? <p>Something went wrong with the upload, try again or choose another file</p> :
                            <p>File well uploaded, check the app lib</p>}
                    </div>
                    <Link to={`/user/${id}/secure-store`}>Mes applications</Link>
                </div>
            }
        </div>
    )
}

export default User;