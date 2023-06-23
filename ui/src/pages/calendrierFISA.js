import React, { useEffect } from 'react';

export default function calendrierFISA() {
    useEffect(() => {
        window.location.href = 'https://basilethiry.fr/back/files/fisaCalendar';
    }, []);

    return (
        <div>
            <h1>File Downloading...</h1>
        </div>
    );
}