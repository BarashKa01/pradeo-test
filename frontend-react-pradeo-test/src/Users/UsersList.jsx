import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseError, setResponseError] = useState(false);

    useEffect(() => {
        fetchUsers();
        return () => { };
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch('http://localhost:5000')
            .then((response => response.json()))
            .then(data => {
                setUsers(data);
                setLoading(false);
                setResponseError(false);
            })
            .catch(() => {
                setUsers([]);
                setLoading(false);
                setResponseError(true);
            });
    }

    return (
        <div>
            <h1>Choose a user</h1>
            <div>
                {loading ? <p>Loading...</p> :
                    responseError === false ? users.map((user) => (
                        <p key={user.id}><Link to={`user/${user.id}`}>{user.first_name}</Link></p>
                    )) :
                        <p>No users can be found or service can't be reached</p>
                }
            </div>
        </div>
    );
}

export default UsersList;