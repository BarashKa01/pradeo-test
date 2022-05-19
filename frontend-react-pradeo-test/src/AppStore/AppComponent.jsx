import { useState, useEffect } from "react";

function AppComponent(props) {

    const [editionMode, setEditionMode] = useState(false);
    const [currentApp, setCurrentApp] = useState(props.app);
    const [updateError, setUpdateError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    useEffect(() => {
        const newApp = {...currentApp};

        newApp.is_verified = props.app.is_verified;
        newApp.is_safe = props.app.is_safe;

        setCurrentApp(newApp);
    }, [props.app]);

    const getAppStatus = () => {
        if (currentApp.is_verified) {
            if (currentApp.is_safe) {
                return "Sûre 👍";
            } else {
                return "Virus 🦟";
            }
        } else {
            return "En cours de vérification 🥁";
        }
    }

    function handleClick(event) {
        event.preventDefault();
        setEditionMode(!editionMode);
    }

    function handleChanges(event) {
        event.preventDefault();
        
        setCurrentApp({
            ...currentApp,
            [event.target.name]: event.target.value,
        })
    }

    function handleSave(event) {
        event.preventDefault();
        fetch(`http://localhost:5000/android-apps/put/`, {
            headers: { 'content-type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(currentApp)
        })
            .then(response => response.json())
            .then((data) => {
                setUpdateError(false);
                setEditionMode(!editionMode);
                setCurrentApp(data);
            })
            .catch(() => {
                setUpdateError(true);
            });
    }

    function handleDelete(event) {
        event.preventDefault();
        fetch(`http://localhost:5000/android-apps/delete/${currentApp.id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then((data) => {
                if (data.message === "1") {
                    setDeleteError(false);
                }
            })
            .catch(() => {
                setDeleteError(true);
            });
    }

    return (
        <div className='app-card'>
            <div>
                {deleteError ? <p>Delete goes wrong, try again</p> : null}
                {updateError ? <p>Update goes wrong, try again</p> : null}
                {editionMode ?
                    <div className="button-container">
                        <p className="button btn-red" onClick={handleClick}>Annuler</p>
                        <p className="button btn-green" onClick={handleSave}>Enregistrer</p>
                    </div>
                    :
                    <div className="button-container">
                        <p className="button btn-blue" onClick={handleClick}>Editer</p>
                        <p className="button btn-red" onClick={handleDelete}>Supprimer</p>
                    </div>
                }
            </div>
            {<div className="content-app-wrapper">
                <label htmlFor="name">Nom : </label>
                {editionMode ?
                   <input type="text" name="name" defaultValue={currentApp.name} onChange={handleChanges} />
                    :
                    <span name="name">{currentApp.name}</span>
                }
            </div>}
            {<div className="content-app-wrapper">
                <label htmlFor="comment">Commentaire : </label>
                {editionMode ?
                    <input type="text" name="comment" defaultValue={currentApp.comment} onChange={handleChanges} />
                    :
                    <span name="comment">{currentApp.comment}</span>
                }
            </div>}

            <p>{getAppStatus()}</p>
        </div>
    );
}

export default AppComponent;