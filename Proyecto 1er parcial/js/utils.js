window.Utils = {
    async hashSHA256(text) {
        const enc = new TextEncoder();
        const data = enc.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    escapeHTML(s) {
        return String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    isValidULEAMEmail(email) {
        const uleamRe = /^[^\s@]+@(?:live\.)?uleam\.edu\.ec$/i;
        return uleamRe.test(email);
    },

    async loadPublicationsFromJSON() {
        try {
            const response = await fetch('data/datos_publicaciones.json');
            const jsonData = await response.json();
            return jsonData.publicaciones.map(p => ({
                id: p.id,
                title: p.titulo,
                authors: p.autor,
                status: p.estado === 'aprobado' ? 'aprobada' : 
                       p.estado === 'pendiente' ? 'en_revision' : p.estado,
                date: p.fecha,
                abstract: p.resumen,
                type: p.categoria,
                createdByName: p.autor
            }));
        } catch (e) {
            console.log('Error cargando datos_publicaciones.json');
            return [];
        }
    },

    async fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Error leyendo el archivo'));
            reader.readAsDataURL(file);
        });
    }
};
