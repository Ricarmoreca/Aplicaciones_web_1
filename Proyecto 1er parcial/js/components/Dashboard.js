const Dashboard = {
    template: `
        <div class="contenedor">
            <nav class="Menú_lateral">
                <h2>Panel ULEAM</h2>
                <router-link to="/publications">Publicaciones</router-link>
                <router-link to="/review">Revisar publicaciones</router-link>
                <router-link to="/query">Consultar publicaciones</router-link>
                <a href="#" @click.prevent="logout">Cerrar sesión</a>
            </nav>

            <section class="resumen">
                <div class="tarjeta">
                    <h3>Publicaciones Totales</h3>
                    <p id="totalCount">{{ totalCount }}</p>
                </div>
                <div class="tarjeta">
                    <h3>Aprobadas</h3>
                    <p id="aprobadasCount">{{ approvedCount }}</p>
                </div>
                <div class="tarjeta">
                    <h3>En Revisión</h3>
                    <p id="revisionCount">{{ reviewCount }}</p>
                </div>
            </section>

            <section class="crear_publicacion">
                <div class="boton_crear">
                    <router-link to="/register-publication" class="btn-crear">Crear publicación</router-link>
                </div>
            </section>
        </div>
    `,
    data() {
        return {
            publications: []
        };
    },
    computed: {
        totalCount() {
            return this.publications.length;
        },
        approvedCount() {
            return this.publications.filter(p => (p.status || '').toLowerCase() === 'aprobada').length;
        },
        reviewCount() {
            return this.publications.filter(p => (p.status || '').toLowerCase() === 'en_revision').length;
        }
    },
    methods: {
        loadPublications() {
            this.publications = JSON.parse(localStorage.getItem('publications') || '[]');
        },
        logout() {
            if (confirm('¿Desea cerrar sesión?')) {
                localStorage.removeItem('session');
                this.$router.push('/');
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