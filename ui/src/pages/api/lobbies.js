import axios from 'axios';

export default async function handler(req, res) {
    try {
        const jwtToken = req.headers.authorization;

        axios.defaults.headers.common['Authorization'] = jwtToken;

        const response = await axios.get('https://basilethiry.fr/back/lobbies/getAll');
        const lobbies = response.data;
        res.status(200).json(lobbies);
    } catch (error) {
        console.error('Erreur lors de la récupération des lobbies:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des lobbies' });
    }
}
