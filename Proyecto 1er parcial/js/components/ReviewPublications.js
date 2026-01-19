const ReviewPublications = {
    template: `
        <div>
            <div class="header">
                <h1>Revisión de publicaciones</h1>
                <div class="top-links">
                    <router-link to="/dashboard">Volver al panel</router-link>
                    <router-link to="/publications">Ver publicaciones</router-link>
                </div>
            </div>

            <div id="msg" class="no-data" v-if="pending.length === 0">
                No hay publicaciones pendientes.
            </div>

            <div id="list">
                <div v-for="pub in pending" :key="pub.id" class="publicacion">
                    <h3>{{ pub.title }}</h3>
                    <p><strong>Autor(es):</strong> {{ pub.authors }}</p>
                    <p><strong>Tipo:</strong> {{ pub.type }}</p>
                    <p><strong>Fecha:</strong> {{ pub.date }}</p>
                    <p><strong>Estado:</strong> {{ pub.status }}</p>
                    <button @click="verPDF(pub)">Ver PDF / DOI</button>
                    <button @click="approve(pub)">Aprobar</button>
                    <button @click="reject(pub)">Rechazar</button>
                    <hr>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            publications: []
        };
    },
    computed: {
        pending() {
            return this.publications.filter(pub => (pub.status || '').toLowerCase() === 'en_revision');
        }
    },
    methods: {
        loadPublications() {
            this.publications = JSON.parse(localStorage.getItem('publications') || '[]');
        },
        verPDF(pub) {
            if (pub.pdfData) {
                const win = window.open();
                win.document.write(`<iframe src="${pub.pdfData}" width="100%" height="100%"></iframe>`);
            } else if (pub.doi) {
                window.open(pub.doi, '_blank');
            } else {
                alert('No hay PDF ni DOI.');
            }
        },
        approve(pub) {
            if (!confirm(`¿Aprobar "${pub.title}"?`)) return;
            const session = JSON.parse(localStorage.getItem('session') || 'null');
            const idx = this.publications.findIndex(p => p.id === pub.id);
            if (idx >= 0) {
                this.publications[idx].status = 'aprobada';
                this.publications[idx].approvedBy = session?.email;
                this.publications[idx].approvedAt = new Date().toISOString();
                localStorage.setItem('publications', JSON.stringify(this.publications));
                alert('✅ Publicación aprobada.');
                this.loadPublications();
            }
        },
        reject(pub) {
            const motivo = prompt('Motivo del rechazo (opcional):');
            if (motivo === null) return;
            const session = JSON.parse(localStorage.getItem('session') || 'null');
            const idx = this.publications.findIndex(p => p.id === pub.id);
            if (idx >= 0) {
                this.publications[idx].status = 'rechazada';
                this.publications[idx].rejectedBy = session?.email;
                this.publications[idx].rejectedReason = motivo || '';
                this.publications[idx].rejectedAt = new Date().toISOString();
                localStorage.setItem('publications', JSON.stringify(this.publications));
                alert('❌ Publicación rechazada.');
                this.loadPublications();
            }
        }
    },
    mounted() {
        const session = JSON.parse(localStorage.getItem('session') || 'null');
        if (!session) {
            this.$router.push('/login');
            return;
        }
        this.loadPublications();
        window.addEventListener('storage', () => this.loadPublications());
    }
};