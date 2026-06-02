export async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3001/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (response.ok) {
            const user = await response.json();
            return user; 
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to log in.');
        }
    }
    catch (err) {
        throw err;
    }
}

export async function getUser() {
    try {
        const response = await fetch('http://localhost:3001/api/sessions/current-user', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            return null; 
        }
    }
    catch (err) {
        throw err; 
    }
}

export async function logout() {
    try {
        const response = await fetch('http://localhost:3001/api/sessions/delete', {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to log out cleanly on server.');
        }
        
        return true;
    }
    catch (err) {
        throw err;
    }
}