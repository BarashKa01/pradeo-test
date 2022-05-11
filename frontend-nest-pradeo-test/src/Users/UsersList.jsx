import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState('Loading...');

    useEffect(() => {
        fectchUsers();
        return () => {};
    }, []);

    const fectchUsers = async () => {
        await fetch('http://localhost:5000')
        .then((response => response.json()))
        .then(data => {
            setUsers(data);
            setLoading('');
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div>
            <h1>Choose a user</h1>
            <div>
                {loading !== '' ? <p>{loading}</p> : 
                users.map((user) => (
                    <p key={user.id}><Link to={`user/${user.id}`}>{user.first_name}</Link></p>
                ))}
            </div>
        </div>
    );
}

export default UsersList;