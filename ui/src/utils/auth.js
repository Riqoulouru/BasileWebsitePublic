const checkLoginStatus = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const response = await fetch('https://basilethiry.fr/back/verifyIfLogin', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const getUserRoles = async () => {

    try {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem("username");


        if (token) {
            const response = await fetch('https://basilethiry.fr/back/user/getRole', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });


            if (response.ok) {
                return await response.json();
            } else {
                // Gérez les erreurs de requête ici
                return [];
            }
        } else {
            // Gérez le cas où il n'y a pas de token ici
            return [];
        }
    } catch (error) {
        // Gérez les erreurs ici
        return [];
    }
};

export { checkLoginStatus, getUserRoles };
