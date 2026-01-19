const Publications = {
    template: `
        <div class="container">
            <div class="header">
                <div>
                    <h1>Publicaciones</h1>
                    <div id="userInfo" class="small">{{ session?.name || 'Usuario' }}</div>
                </div>
                <div>
                    <div class="counts" id="counts">
                        Totales: {{ publications.length }} • 
                        Aprobadas: {{ approvedCount }} • 
                        En revisión: {{ reviewCount }}
                    </div>
                    <button v-if="canCreate" @click="goToCreate" id="btnCrear">Crear publicación</button>
                    <a href="#" @click.prevent="logout" id="logout">Cerrar sesión</a>
                </div>
            </div>

            <div id="pubList" class="grid">
                <article v-for="pub in filteredPublications" :key="pub.id" class="pub" :data-id="pub.id">
                    <h3>{{ pub.title }}</h3>
                    <div class="meta">
                        <strong>Autores:</strong> {{ pub.authors }} • 
                        <strong>Tipo:</strong> {{ pub.type || '' }} • 
                        <strong>Año:</strong> {{ pub.date ? pub.date.slice(0, 4) : '' }}
                    </div>
                    <div class="meta">
                        <strong>Estado:</strong> {{ pub.status || '' }} • 
                        <strong>Creado por:</strong> {{ pub.createdByName || 'Anónimo' }}
                    </div>
                    <p class="resumen">{{ pub.abstract || '' }}</p>
                    <div class="links">
                        <a v-if="pub.doi" :href="pub.doi" target="_blank">DOI/Enlace</a>
                        <a v-if="pub.pdfData" :href="pub.pdfData" :download="getPDFName(pub)">PDF</a>
                        <button v-if="canDelete(pub)" @click="deletePub(pub.id)" class="btnEliminar">🗑️ Eliminar</button>
                    </div>
                </article>
            </div>

            <div v-if="filteredPublications.length === 0" id="noData" class="no-data">
                No hay publicaciones registradas.
            </div>
        </div>
    `,
    data() {
        return {
            publications: [],
            session: JSON.parse(localStorage.getItem('session') || 'null')
        };
    },
    computed: {
        approvedCount() {
            return this.publications.filter(p => (p.status || '').toLowerCase() === 'aprobada').length;
        },
        reviewCount() {
            return this.publications.filter(p => (p.status || '').toLowerCase() === 'en_revision').length;
        },
        canCreate() {
            const role = (this.session?.rol || '').toLowerCase();
            return role === 'docente' || role === 'administrador' || role === 'administrativo';
        },
        filteredPublications() {
            const role = (this.session?.rol || '').toLowerCase();
            if (role === 'docente' || role === 'estudiante') {
                return this.publications.filter(p => (p.status || '').toLowerCase() === 'aprobada');
            }
            return this.publications;
        }
    },
    methods: {
        loadPublications() {
            const pubs = JSON.parse(localStorage.getItem('publications') || '[]');
            this.publications = pubs;
        },
        canDelete(pub) {
            const role = (this.session?.rol || '').toLowerCase();
            if (role === 'administrador' || role === 'administrativo') return true;
            if (role === 'docente' && (pub.createdBy || '').toLowerCase() === (this.session?.email || '').toLowerCase()) {
                return true;
            }
            return false;
        },
        deletePub(id) {
            if (!confirm('¿Deseas eliminar esta publicación?')) return;
            const allPubs = this.publications.filter(p => p.id != id);
            localStorage.setItem('publications', JSON.stringify(allPubs));
            this.loadPublications();
            alert('✅ Publicación eliminada correctamente.');
        },
        getPDFName(pub) {
            return (pub.title || 'publicacion').replace(/[^a-z0-9\-]/gi, '_') + '.pdf';
        },
        goToCreate() {
            this.$router.push('/register-publication');
        },
        logout() {
            if (confirm('¿Desea cerrar sesión?')) {
                localStorage.removeItem('session');
                this.$router.push('/');
            }
        }
    },
    mounted() {
        if (!this.session) {
            this.$router.push('/login');
            return;
        }
        this.loadPublications();
        window.addEventListener('storage', () => this.loadPublications());
    }
};